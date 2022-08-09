import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from '../files/files.service';
import { ProductsImg } from '../productsImgs/entities/productsImg.entity';
import { ProductsTag } from '../productsTags/entities/productsTag.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, // Repository 추가를 위한 모듈 추가.
      ProductsTag,
      ProductsImg,
      Recipe,
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    FilesService,
  ],
})
export class ProductsModule {}
