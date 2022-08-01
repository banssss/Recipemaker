import { Field, ObjectType } from '@nestjs/graphql';
import { Recipe } from 'src/apis/recipes/entities/recipe.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Material {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  name: string;

  // N:M 은 서로 선언해야한다. recipe.entity.ts 참조
  @JoinTable() // N:M 관계에서, 기준인 곳을 명시. (둘 중 어디다 선언해도 상관 없다.)
  @ManyToMany(() => Recipe, (recipes) => recipes.materials)
  @Field(() => [Recipe])
  recipes: Recipe[];

  // N:M 은 서로 선언해야한다. user.entity.ts 참조
  @JoinTable() // N:M 관계에서, 기준인 곳을 명시. (둘 중 어디다 선언해도 상관 없다.)
  @ManyToMany(() => User, (users) => users.materials)
  @Field(() => [User])
  users: User[];
}
