import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsCategory } from './entities/productsCategory.entity';
import { ProductsCategoriesService } from './productsCategories.service';

@Resolver()
export class ProductsCategoriesResolver {
  constructor(
    private readonly productsCategoriesService: ProductsCategoriesService,
  ) {}

  // 카테고리 생성
  @Mutation(() => ProductsCategory)
  createProductsCategory(
    @Args('name') name: string, //
  ) {
    return this.productsCategoriesService.create({ name });
  }

  // 모든 카테고리 조회
  @Query(() => [ProductsCategory])
  fetchProductsCategories() {
    return this.productsCategoriesService.findAll();
  }

  // 카테고리 이름 수정
  @Mutation(() => ProductsCategory)
  updateProductsCategory(
    @Args('productsCategoryId') productsCategoryId: string,
    @Args('updateProductsCategoryName') updateProductsCategoryName: string, //
  ) {
    return this.productsCategoriesService.update({
      productsCategoryId,
      updateProductsCategoryName,
    });
  }
}
