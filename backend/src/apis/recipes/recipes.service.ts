import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  // fetchRecipes (모든상품)
  async findAll() {
    return this.recipeRepository.find();
  }

  // fetchRecipe (단일상품)
  async findOne({ recipeId }) {
    const result = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    return result;
  }

  async create({ createRecipeInput }) {
    const result = await this.recipeRepository.save({
      ...createRecipeInput, // Spread 연산자를 이용하여 한번에 입력받기.
    });
    return result; // 생성된 데이터 정보 리턴
  }

  async update({ recipeId, updateRecipeInput }) {
    const myRecipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });

    // Repository.save() -> update data and 'return updated data'
    const result = this.recipeRepository.save({
      ...myRecipe,
      id: recipeId,
      ...updateRecipeInput,
      // ...myRecipe 를 통해 기존 값을 모두 재 입력
      // ...updateRecipeInput 을 통해 수정된 값만 재할당
    });
    return result;
  }

  async delete({ recipeId }) {
    // 소프트 삭제 (TypeORM 제공) - softDelete 메소드 사용
    const result = await this.recipeRepository.softDelete({ id: recipeId }); // id값 이외에 다른 것으로도 삭제 가능
    return result.affected ? true : false;
  }
}
