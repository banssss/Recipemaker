import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRecipeInput } from './dto/createRecipe.input';
import { UpdateRecipeInput } from './dto/updateRecipe.input';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';

@Resolver()
export class RecipesResolver {
  constructor(
    private readonly recipesService: RecipesService, //
  ) {}

  // 모든 Recipe 조회
  @Query(() => [Recipe]) // Recipe 의 배열형태로 리턴.
  fetchRecipes() {
    return this.recipesService.findAll();
  }

  // 단일 Recipe 조회 - id값으로
  @Query(() => Recipe)
  async fetchRecipe(
    @Args('recipeId') recipeId: string, // arguments 로 recipeId 를 입력받는다.
  ) {
    return this.recipesService.findOne({ recipeId });
  }

  // 새로운 Recipe 생성.
  @Mutation(() => Recipe) // 생성한 Recipe 를 return 으로 설정하여 입력내용을 표기.
  async createRecipe(
    @Args('createRecipeInput') createRecipeInput: CreateRecipeInput, //
  ) {
    // 상품 등록하기
    return this.recipesService.create({ createRecipeInput });
  }

  // Recipe 수정
  @Mutation(() => Recipe) // 수정한 Recipe 를 return 으로 설정하여 수정내용을 표기.
  async updateRecipe(
    @Args('recipeId') recipeId: string,
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput, //
  ) {
    // 수정하기
    return this.recipesService.update({ recipeId, updateRecipeInput });
  }

  // 레시피 삭제 구현 - Repository.softDelete 를 이용하여.
  @Mutation(() => Boolean)
  deleteRecipe(
    @Args('recipeId') recipeId: string, //
  ) {
    return this.recipesService.delete({ recipeId });
  }
}
