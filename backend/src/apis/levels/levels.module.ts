import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelsResolver } from './levels.resolver';
import { LevelsService } from './levels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Level, //
    ]),
  ],
  providers: [
    LevelsResolver, //
    LevelsService,
  ],
})
export class LevelsModule {}
