import { Field, InputType, PickType } from '@nestjs/graphql';
import { Recipe } from '../entities/recipe.entity';

@InputType()
export class CreateRecipeInput extends PickType(
  Recipe,
  ['recipeTitle', 'recipeSubtitle', 'recipeDescription'],
  InputType,
) {} // PickType 사용해보기

// export class CreateRecipeInput {
//   @Field(() => String)
//   recipeTitle: string;

//   @Field(() => String)
//   recipeSubtitle: string;

//   @Field(() => String)
//   recipeDescription: string;
// }
