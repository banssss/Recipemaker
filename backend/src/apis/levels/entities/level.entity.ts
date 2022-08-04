import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RECIPE_LEVEL } from 'src/commons/type/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

registerEnumType(RECIPE_LEVEL, {
  name: 'RECIPE_LEVEL',
});

@Entity()
@ObjectType()
export class Level {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: RECIPE_LEVEL,
    default: RECIPE_LEVEL.EASY,
  })
  @Field(() => RECIPE_LEVEL)
  level: string;
}
