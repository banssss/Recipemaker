import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateRecipeInput } from 'src/apis/recipes/dto/createRecipe.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  productName: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => Date)
  termValidity: Date;

  @Min(0)
  @Field(() => Float)
  productWeight: number;

  @Field(() => String)
  productDescription: string;

  @Min(0)
  @Field(() => Int)
  amount: number;

  // 상품 카테고리 ID 를 추가하여 함께 등록하기 위한 Field (N:1)
  @Field(() => String)
  productsCategoryId: string;

  // [과제용] 상품에 해당하는 레시피를 함께 등록하기 위한 Field (1:1)
  @Field(() => CreateRecipeInput)
  matchRecipe: CreateRecipeInput;

  // 상품에 달린 태그를 함께 등록하기 위한 Field (N:M)
  @Field(() => [String])
  productsTags: string[];

  // 상품에 연결된 이미지(url)를 함께 등록하기 위한 Field (1:N)
  @Field(() => [String])
  productsImgs: string[];
}
