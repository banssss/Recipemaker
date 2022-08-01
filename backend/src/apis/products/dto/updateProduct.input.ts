import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './createProduct.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  // PartialType 추가로, 내부 내용을 nullable 하게 상속할 수 있다.
}
