import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RecipeLevel {
  EXTREME = 'extreme',
  HARD = 'hard',
  NORMAL = 'normal',
  EASY = 'easy',
}

@Entity()
@ObjectType()
export class Level {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: RecipeLevel,
    default: RecipeLevel.EASY,
  })
  @Field(() => String)
  level: RecipeLevel;
}
