import { Field, ObjectType } from '@nestjs/graphql';
import { Material } from 'src/apis/materials/entities/material.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100, unique: true })
  @Field(() => String)
  userAccount: string;

  @Column('varchar', { length: 100 })
  // @Field(() => String) // password 는 front 에게 응답하지 않기 위함.
  password: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  name: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  nickname: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  phone: string;

  @Column('varchar', { length: 100, unique: true })
  @Field(() => String)
  email: string;

  @Column('varchar', { length: 100, default: 0 })
  @Field(() => String)
  point: number;

  @Column('varchar', { length: 100, nullable: true })
  @Field(() => String)
  creditInfo: string;

  // 생성할 때의 시간정보 저장
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // 수정될 때의 시간정보 저장
  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  // 삭제 (회원탈퇴-softDelete) 할 때의 시간정보 저장
  @DeleteDateColumn()
  deletedAt: Date;

  // N:M 은 서로 선언해야한다. material.entity.ts 참조
  @ManyToMany(() => Material, (materials) => materials.users)
  @Field(() => [Material])
  materials: Material[];
}
