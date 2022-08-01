import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class RecipesCategory {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100, unique: true })
  @Field(() => String)
  name: string;
}
