import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 모든 사용자 출력
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  // Id값이 일치하는 사용자 출력
  @Query(() => User)
  fetchUser(
    @Args('userMail') userMail: string, //
  ) {
    return this.usersService.findOne({ userMail });
  }

  // 로그인(userLogin)중인 user 한 사람 조회 API
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.findOne({ userMail: context.req.user.email });
  }

  // 사용자 생성
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    return this.usersService.create({ createUserInput });
  }

  // 사용자 정보 수정
  @Mutation(() => User)
  async updateUser(
    @Args('userMail') userMail: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    // 사용자 정보 수정 전, password 정보의 일치 여부를 확인한다.
    await this.usersService.checkUserPassword({
      userMail,
      password: updateUserInput.password,
    });
    // 사용자 정보 수정 전, userAccount 정보의 중복 여부를 확인한다.
    await this.usersService.checkUserAccount({
      userAccount: updateUserInput.userAccount, //
    });
    // 사용자 정보 수정하기
    return this.usersService.updateUser({
      userMail, //
      updateUserInput,
    });
  }

  // 로그인(userLogin)중인 user의 비밀번호를 변경하는 API
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: any, //
    @Args('userPwd') userPwd: string,
    @Args('newPwd') newPwd: string,
  ) {
    // 사용자 정보 수정 전, password 정보의 일치 여부를 확인한다.
    await this.usersService.checkUserPassword({
      userMail: context.req.user.email,
      password: userPwd,
    });
    // 사용자 정보 수정하기
    return this.usersService.updateUserPwd({
      userMail: context.req.user.email,
      newPwd,
    });
  }

  // 유저 삭제(탈퇴)
  @Mutation(() => Boolean) // 성공 여부 리턴
  deleteUser(
    @Args('userMail') userMail: string, //
  ) {
    return this.usersService.deleteUser({ userMail });
  }

  // 로그인(userLogin)중인 user를 삭제(탈퇴)하는 API
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.deleteUser({
      userMail: context.req.user.email,
    });
  }

  // 삭제(탈퇴) 유저 복구
  @Mutation(() => Boolean) // 성공 여부 리턴
  restoreDeletedUser(
    @Args('userId') userId: string, // 유저 복구는 id 값을 기준으로 복구.
  ) {
    return this.usersService.restoreDeletedUser({ userId });
  }
}
