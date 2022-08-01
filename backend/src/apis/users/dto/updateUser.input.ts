import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  userAccount: string;

  // email 은 계정의 정보 (unique) 로 판단, 수정불가.
  // @Field(() => String)
  // email: string;

  // 수정 시 기존 비밀번호를 입력받아 일치여부를 확인 후 수정 진행
  @Field(() => String)
  password: string;

  // 만약, 새로운 패스워드가 입력된다면 새로 입력받은 패스워드로 변겅
  @Field(() => String, { nullable: true })
  newPassword: string;
}
