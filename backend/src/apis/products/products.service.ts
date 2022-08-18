import {
  SearchResponse,
  AggregationsAggregate,
} from '@elastic/elasticsearch/lib/api/types';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { ProductsImg } from '../productsImgs/entities/productsImg.entity';
import { ProductsTag } from '../productsTags/entities/productsTag.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // Recipe Repository Inject
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    // ProductsTag Repository Inject
    @InjectRepository(ProductsTag)
    private readonly productsTagRepository: Repository<ProductsTag>,

    // ProductsImg Repository Inject
    @InjectRepository(ProductsImg)
    private readonly productsImgRepository: Repository<ProductsImg>,

    // files service
    private readonly filesService: FilesService,

    // 엘라스틱서치를 사용하기 위한 주입
    private readonly elasticsearchService: ElasticsearchService,

    // redis 사용을 위한 cacheManager 선언
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // fetchProducts (모든상품)
  async findAll() {
    const result = await this.productRepository.find({
      relations: ['productsCategory', 'matchRecipe', 'productsTags'],
    });
    // Date 표기 임시처리
    let value: { termValidity: string | number | Date };
    for (value of result) {
      value.termValidity = new Date(value.termValidity);
    }
    return result;
  }

  // fetchProducts by search keyword (모든상품)
  async searchAll({ search }) {
    // 1. Redis에 해당 검색어에 대한 검색 결과가 캐시 되어있는지 확인.
    const myCache = await this.cacheManager.get(search);
    // 2. Redis에 Cache가 등록되어 있다면, 캐시되어있는 결과를 클라이언트에 반환
    if (myCache) {
      return myCache;
    }

    // 3. Redis에 등록된 Cache가 없다면 ElasticSearch 에서 해당 검색어 검색.
    let esResult: SearchResponse<
      unknown,
      Record<string, AggregationsAggregate>
    >;

    // 검색어가 한 글자일 경우 - prefix 적용한 auto-complete 검색 실행
    if (search.length === 1) {
      console.log('===1===');
      console.log(search);
      esResult = await this.elasticsearchService.search({
        index: 'search-product-name',
        query: {
          bool: {
            // ***** prefix를 적용한 Query DSL - auto-complete ***** //
            should: [{ prefix: { productname: search } }],
          },
        },
      });
      console.log('===1=2==');
      console.log(JSON.stringify(esResult, null, '  '));
      //검색어가 한 글자가 아닐 경우 - match 이용한 검색
    } else {
      console.log('===2===');
      console.log(search);
      esResult = await this.elasticsearchService.search({
        index: 'search-product-name',
        query: {
          // // 3-a. 클라이언트에서 받은 검색어를 match 쿼리를 이용하여 상품 이름에서 검색.
          // // match 를 이용하면, 검색어 또한 '토큰화' 되어 재검색
          // match: { productname: search },
          // 3-a. 클라이언트에서 받은 검색어를 term 쿼리를 이용하여 상품 이름에서 검색.
          // term 을 이용하면, 검색어를 토큰화하지 않고 정확히 검색!
          term: { productname: search },
        },
      });
      console.log('===2=2==');
      console.log(JSON.stringify(esResult, null, '  '));
    }

    // 4. ElasticSearch에서 조회한 결과를 Redis에 저장.
    // *** 검색결과로 보여질 값들만 전달하기 - logstash에서 update한 column들로 *** //
    const products = esResult.hits.hits.map((esProduct) => {
      const product = {
        id: esProduct._id,
        productName: esProduct._source['productname'],
        price: esProduct._source['price'],
        productDescription: esProduct._source['productdescription'],
      };
      return product;
    });
    // Redis 에 검색어를 key 값으로, 검색결과를 value 값으로 set
    await this.cacheManager.set(search, products, {
      ttl: 60, // 60sec
    });
    // 5. 조회한 결과 ([Product]) 를 클라이언트에 반환.
    console.log('----', products);
    return products;
  }

  // fetchProductsWithDeleted (삭제된 상품을 포함한 모든 상품)
  async findAllWithDeleted() {
    const result = await this.productRepository.find({
      relations: ['productsCategory', 'matchRecipe', 'productsTags'],
      withDeleted: true,
    });
    // Date 표기 임시처리
    let value: { termValidity: string | number | Date };
    for (value of result) {
      value.termValidity = new Date(value.termValidity);
    }
    return result;
  }

  // fetchProduct (단일상품)
  async findOne({ productId }) {
    const result = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['productsCategory', 'matchRecipe', 'productsTags'],
    });
    // Date 표기 임시처리
    result.termValidity = new Date(result.termValidity);
    return result;
  }

  async create({ createProductInput }) {
    // 상품, 상품 카테고리( 그리고, [과제용] 레시피 ), 상품 이미지를 같이 등록하기.
    const {
      matchRecipe,
      productsCategoryId,
      productsTags,
      productsImgs,
      ...product
    } = createProductInput;

    // [과제용] 레시피 recipeRepository 에 등록하기.
    const createRecipeResult = await this.recipeRepository.save({
      ...matchRecipe,
    });

    // productsTags 모두 등록하기 Promise.all 적용
    const createdTags = await Promise.all(
      productsTags.map(
        (el: string) =>
          new Promise(async (resolve, reject) => {
            try {
              const tagName = el.replace('#', '');
              const prevTag = await this.productsTagRepository.findOne({
                where: { name: tagName },
              });
              if (prevTag) {
                resolve(prevTag);
              } else {
                const newTag = await this.productsTagRepository.save({
                  name: tagName,
                });
                resolve(newTag);
              }
            } catch (e) {
              reject(e);
            }
          }),
      ),
    );

    // const createdTags = [];
    // for (let i = 0; i < productsTags.length; i++) {
    //   //tag에서 해시태그(#)제거
    //   const tagName = productsTags[i].replace('#', '');

    //   // 입력받은 tagName이 이미 productsTagRepository에 저장되었는지 찾아보기 위한 prevTag
    //   const prevTag = await this.productsTagRepository.findOne({
    //     where: { name: tagName },
    //   });

    //   // 이미 태그가 존재한다면
    //   if (prevTag) {
    //     createdTags.push(prevTag);
    //     // 존재하는 태그가 없다면
    //   } else {
    //     const newTag = await this.productsTagRepository.save({
    //       name: tagName,
    //       // N:M 관계는, 둘 중 하나만 연결해주면 둘 다 연결된다.
    //     });
    //     createdTags.push(newTag);
    //   }
    // }

    // product 정보 저장
    const result = await this.productRepository.save({
      ...product,
      productsCategory: { id: productsCategoryId }, // id값에 맞는 productsCategory와 연결
      matchRecipe: createRecipeResult, // 저장된 레시피 결과 통째로 넣기
      productsTags: createdTags, // 생성된 태그 결과 넣기
    });

    // 클라이언트에게 입력받은 상품 이미지 생성하여 함께 입력하기
    // const createdImgs = await Promise.all(
    await Promise.all(
      productsImgs.map(
        (imgUrl: any) =>
          new Promise(async (resolve, reject) => {
            try {
              const newImg = await this.productsImgRepository.save({
                productsImgUrl: imgUrl,
                product: { id: result.id }, // product 와 img 연결
              });
              resolve(newImg);
            } catch (e) {
              reject(e);
            }
          }),
      ),
    );
    // 생성된 이미지 출력 테스트
    // console.log(createdImgs);

    return result; // 생성된 데이터 정보 리턴
  }

  async update({ productId, updateProductInput }) {
    const myProduct = await this.productRepository.findOne({
      where: { id: productId },
    });

    //  productsImgs 분리하기
    const { productsImgs, ...updateInput } = updateProductInput;

    // productImgs 입력된 경우
    if (productsImgs) {
      // 기존 id에 속한 이미지 모두 불러오기
      const prevImgs = await this.productsImgRepository.find({
        where: { product: { id: productId } },
      });
      // 불러온 기존 이미지에서 파일이름 추출
      const fileNames = prevImgs.map((el) =>
        el.productsImgUrl.replace('codecamp-backend04-storage/', ''),
      );

      // 이미지 테이블에서 상품 id가 일치하는 데이터 모두 삭제하기 (과제 1번로직 -> 2번단계)
      await this.productsImgRepository.delete({ product: { id: productId } });
      // 실제 cloud에서 파일 삭제하기 (과제 Advanced)
      await this.filesService.delete({ fileNames });

      // Promise.all 을 이용하여, 입력받은 이미지들 저장하기
      // const updateImgs = await Promise.all(
      await Promise.all(
        productsImgs.map(
          (imgUrl: any) =>
            new Promise(async (resolve, reject) => {
              try {
                const newImg = await this.productsImgRepository.save({
                  productsImgUrl: imgUrl,
                  product: { id: productId }, // product 와 img 연결
                });
                resolve(newImg);
              } catch (e) {
                reject(e);
              }
            }),
        ),
      );
      // console.log(updateImgs); // 업데이트 된 이미지 테스트 출력
    }

    // Repository.update() -> update data 'only'
    // this.productRepository.update({ id: productId }, { ...updateProductInput });

    // Repository.save() -> update data and 'return updated data'
    const result = this.productRepository.save({
      ...myProduct,
      id: productId,
      ...updateInput,
      // ...myProduct 를 통해 기존 값을 모두 재 입력
      // ...updateInput 을 통해 수정된 값만 재할당
    });
    return result;
  }

  checkTermValidityOnUpdate({ updateProductInput }) {
    // today - 오늘날짜 | productTermValidity - 입력받은 날짜
    const today = new Date();
    const productTermValidity = new Date(updateProductInput.termValidity);

    if (productTermValidity < today)
      throw new UnprocessableEntityException(
        '유통기한이 지난 상품입니다. 데이터를 수정할 수 없습니다.',
      );
  }

  checkTermValidityOnCreate({ createProductInput }) {
    // today - 오늘날짜 | productTermValidity - 입력받은 날짜
    const today = new Date();
    const productTermValidity = new Date(createProductInput.termValidity);

    if (productTermValidity < today)
      throw new UnprocessableEntityException(
        '유통기한이 지난 상품입니다. 데이터를 등록할 수 없습니다.',
      );
  }

  async delete({ productId }) {
    // 소프트 삭제 (TypeORM 제공) - softDelete 메소드 사용
    const result = await this.productRepository.softDelete({ id: productId }); // id값 이외에 다른 것으로도 삭제 가능
    return result.affected ? true : false;
  }

  async restoreDeleted({ productId }) {
    // 삭제된 데이터 복구 - restore 메소드 사용
    const result = await this.productRepository.restore({ id: productId });
    return result.affected ? true : false;
  }
}
