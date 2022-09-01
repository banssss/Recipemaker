import { Mutation, Resolver } from '@nestjs/graphql';
import { IamportsService } from './iamports.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class IamportsResolver {
  constructor(
    private readonly iamportsService: IamportsService, //
  ) {}

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => Boolean)
  async createIamportAuth() {
    const token = await this.iamportsService.getImpAccessToken();
    // const today = new Date().getTime();
    return token ? true : false;
  }
}
