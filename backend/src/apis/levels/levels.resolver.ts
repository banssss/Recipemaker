import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Level, RecipeLevel } from './entities/level.entity';
import { LevelsService } from './levels.service';

@Resolver()
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  @Mutation(() => Level)
  createLevel(
    @Args('recipeLevel') recipeLevel: RecipeLevel, //
  ) {
    return this.levelsService.create({ recipeLevel });
  }
}
