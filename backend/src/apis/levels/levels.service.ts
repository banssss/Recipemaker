import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}
  async create({ recipeLevel }) {
    // DB에 Level 등록
    const result = await this.levelRepository.save({ level: recipeLevel });
    console.log(result);
    return result;
  }
}
