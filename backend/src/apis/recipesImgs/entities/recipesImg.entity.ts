import { Field, ObjectType } from '@nestjs/graphql';
import { Recipe } from 'src/apis/recipes/entities/recipe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class RecipesImg {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  recipesImgUrl: string;

  @Column({ type: 'tinyint', width: 1 })
  @Field(() => Boolean)
  recipesImgIsmain: boolean;

  // 레시피이미지와 레시피의 관계는 N:1
  @ManyToOne(() => Recipe)
  @Field(() => Recipe)
  recipe: Recipe;
}
