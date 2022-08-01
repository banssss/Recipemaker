import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsCategory } from './entities/productsCategory.entity';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectRepository(ProductsCategory)
    private readonly productsCategoryRepository: Repository<ProductsCategory>,
  ) {}
  async create({ name }) {
    // DB에 카테고리 등록
    const result = await this.productsCategoryRepository.save({ name: name });
    return result;
  }

  // 모든 카테고리 조회
  findAll() {
    const result = this.productsCategoryRepository.find();
    return result;
  }

  // 카테고리 수정
  async update({ productsCategoryId, updateProductsCategoryName }) {
    const myProductCategory = await this.productsCategoryRepository.findOne({
      where: { id: productsCategoryId },
    });

    const result = this.productsCategoryRepository.save({
      ...myProductCategory,
      id: productsCategoryId,
      name: updateProductsCategoryName,
    });
    return result;
  }
}
