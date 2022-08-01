import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  // 모든 Product 조회
  @Query(() => [Product]) // Product 의 배열형태로 리턴.
  fetchProducts() {
    return this.productsService.findAll();
  }

  // 삭제된 데이터를 포함한 모든 Product 조회
  @Query(() => [Product]) // Product 의 배열형태로 리턴.
  fetchProductsWithDeleted() {
    return this.productsService.findAllWithDeleted();
  }

  // 단일 Product 조회 - id값으로
  @Query(() => Product)
  async fetchProduct(
    @Args('productId') productId: string, // arguments 로 productId 를 입력받는다.
  ) {
    return this.productsService.findOne({ productId });
  }

  // 새로운 Product 생성.
  @Mutation(() => Product) // 생성한 Product 를 return 으로 설정하여 입력내용을 표기.
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput, //
  ) {
    // 상품의 유통기한 확인하기
    await this.productsService.checkTermValidityOnCreate({
      createProductInput,
    });
    // 상품 등록하기
    return this.productsService.create({ createProductInput });
  }

  // Product 수정.
  @Mutation(() => Product) // 수정한 Product 를 return 으로 설정하여 수정내용을 표기.
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput, //
  ) {
    // Product 수정 전, 수정진행 가능 여부를 체크한다.
    // 상품의 유통기한 확인하기
    await this.productsService.checkTermValidityOnUpdate({
      updateProductInput,
    });
    // 수정하기
    return this.productsService.update({ productId, updateProductInput });
  }

  // 상품(밀키트) 삭제 - Repository.softDelete 를 이용하여.
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.delete({ productId });
  }

  // 삭제된 상품(밀키트) 복구 - Repository.restore 를 이용하여.
  @Mutation(() => Boolean)
  restoreProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.restoreDeleted({ productId });
  }
}
