import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { ProductsImgsService } from './productsImgs.service';

@Resolver()
export class ProductsImgsResolver {
  constructor(
    private readonly productImgsService: ProductsImgsService, //
  ) {}

  // 미완성 로직 (22.08.09)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [String])
  createProductsImgsAll(
    @Args({ name: 'images', type: () => [String] }) images: string[], //
  ) {
    // url 들을 한번에 저장. 저장한 url 리턴
    return this.productImgsService.createAll({ images });
  }
}
