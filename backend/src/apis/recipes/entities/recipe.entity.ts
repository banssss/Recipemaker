import { Field, ObjectType } from '@nestjs/graphql';
import { RecipesCategory } from 'src/apis/recipesCategories/entities/recipesCategory.entity';
import { Level } from 'src/apis/levels/entities/level.entity';
import { Material } from 'src/apis/materials/entities/material.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  recipeTitle: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  recipeSubtitle: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  recipeDescription: string;

  // softDelete 를 위한 @DeleteDateColumn()
  @DeleteDateColumn()
  deletedAt: Date;

  // 레시피와 레시피_카테고리는 N:1 관계
  @ManyToOne(() => RecipesCategory)
  @Field(() => RecipesCategory)
  recipesCategory: RecipesCategory;

  // 레시피와 (조리)난이도는 N:1 관계
  @ManyToOne(() => Level)
  @Field(() => Level)
  level: Level;

  // // [과제용] 1:1 관계의 기준을 Product로 변경
  // // 레시피와 제품(밀키트)의 관계는 1:1 관계
  // @JoinColumn() // 1:1 관계에서, 기준이 되는 Column임을 표현
  // @OneToOne(() => Product)
  // @Field(() => Product)
  // product: Product;

  // N:M 은 서로 선언해야한다. material.entity.ts 참조
  @ManyToMany(() => Material, (materials) => materials.recipes)
  @Field(() => [Material])
  materials: Material[];
}
