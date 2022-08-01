import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategory } from './entities/productsCategory.entity';
import { ProductsCategoriesResolver } from './productsCategories.resolver';
import { ProductsCategoriesService } from './productsCategories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsCategory, //
    ]),
  ],
  providers: [
    ProductsCategoriesResolver, //
    ProductsCategoriesService,
  ],
})
export class ProductsCategoriesModule {}
