import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { IamportsService } from './iamports.service';
import { IContext } from 'src/commons/type/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class IamportsResolver {
  constructor(
    private readonly iamportsService: IamportsService, //
  ) {}

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => Boolean)
  async createIamportAuth(
    @Context() Context: IContext, //
  ) {
    const token = await this.iamportsService.getImpAccessToken();
    const today = new Date().getTime();
    console.log(token);
    console.log(today);
    return token ? true : false;
  }
}
