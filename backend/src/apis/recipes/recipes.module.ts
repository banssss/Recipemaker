import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe, // Repository 추가를 위한 모듈 추가.
    ]),
  ],
  providers: [
    RecipesResolver, //
    RecipesService,
  ],
})
export class RecipesModule {}
