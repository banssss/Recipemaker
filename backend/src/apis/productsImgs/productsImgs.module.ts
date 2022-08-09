import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsImg } from './entities/productsImg.entity';
import { ProductsImgsResolver } from './productsImgs.resolver';
import { ProductsImgsService } from './productsImgs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsImg, // Repository 추가를 위한 모듈 추가
    ]),
  ],
  providers: [
    ProductsImgsResolver, //
    ProductsImgsService,
  ],
})
export class ProductsImgsModule {}
