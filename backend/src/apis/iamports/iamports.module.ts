import { Module } from '@nestjs/common';
import { IamportsResolver } from './iamports.resolver';
import { IamportsService } from './iamports.service';

@Module({
  imports: [],
  providers: [
    IamportsResolver, //
    IamportsService,
  ],
})
export class IamportsModule {}
