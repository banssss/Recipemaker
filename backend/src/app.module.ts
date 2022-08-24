import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { LevelsModule } from './apis/levels/levels.module';
import { ProductsModule } from './apis/products/products.module';
import { RecipesModule } from './apis/recipes/recipes.module';
import { UsersModule } from './apis/users/users.module';
import { AuthsModule } from './apis/auths/auths.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { IamportsModule } from './apis/iamports/iamports.module';
import { ProductsImgsModule } from './apis/productsImgs/productsImgs.module';
import { FilesModule } from './apis/files/files.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthsModule,
    FilesModule, // 파일 관리 모듈 추가
    IamportsModule,
    LevelsModule,
    PaymentsModule,
    ProductsModule,
    ProductsCategoriesModule,
    ProductsImgsModule, // 상품 이미지 모듈 추가
    RecipesModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }), // GraphQL Module 설정 추가
      // Cors 추가
      cors: {
        origin: ['http://localhost:3000'],
        credential: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    // redis 연결을 위한 CacheModule 추가
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
