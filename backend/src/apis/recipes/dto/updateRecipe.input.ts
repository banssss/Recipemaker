import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRecipeInput } from './createRecipe.input';

@InputType()
export class UpdateRecipeInput extends PartialType(CreateRecipeInput) {
  // PartialType 추가로, 내부 내용을 nullable 하게 상속할 수 있다.
}
