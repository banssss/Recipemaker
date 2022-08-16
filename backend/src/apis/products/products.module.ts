import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
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
      Product, //
      ProductsTag,
      ProductsImg,
      Recipe,
    ]),
    // ElasticSearch 적용을 위한 Module Import
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200', //
    }),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    FilesService,
  ],
})
export class ProductsModule {}
