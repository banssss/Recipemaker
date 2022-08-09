import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsImg } from './entities/productsImg.entity';

@Injectable()
export class ProductsImgsService {
  constructor(
    @InjectRepository(ProductsImg)
    private readonly productsImgRepository: Repository<ProductsImg>,
  ) {}

  // 미완성 로직 (22.08.09)
  // createAll (입력된 이미지url 모두 저장)
  async createAll({ images }) {
    //
    const img = images[0];

    const result = await this.productsImgRepository.save({
      productsImgUrl: img,
    });

    return result.productsImgUrl;
  }
}
