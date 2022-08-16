import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductsCategory } from 'src/apis/productsCategories/entities/productsCategory.entity';
import { ProductsTag } from 'src/apis/productsTags/entities/productsTag.entity';
import { Recipe } from 'src/apis/recipes/entities/recipe.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  productName: string;

  @Column({ type: 'mediumint', width: 10 })
  @Field(() => Int)
  price: number;

  @Column({ type: 'date', nullable: false })
  @Field(() => Date) // Date 형식으로 출력 시 ...to return non-nullable value, returned: null 오류 출력... 이유 찾는중
  // @Field(() => String) // 날짜 데이터 문자열로 출력.
  termValidity: Date;

  @Column('decimal', { precision: 5, scale: 1 })
  @Field(() => Float)
  productWeight: number;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  productDescription: string;

  @Column({ type: 'smallint', width: 10, default: 0 })
  @Field(() => Int)
  amount: number;

  // softDelete 를 위한 @DeleteDateColumn()
  @DeleteDateColumn()
  deletedAt: Date;

  // Update 시간을 기록하기 위한 Column
  @UpdateDateColumn()
  updatedAt: Date;

  // 제품은 제품_카테고리와 N:1 관계
  @ManyToOne(() => ProductsCategory)
  @Field(() => ProductsCategory)
  productsCategory: ProductsCategory;

  // [과제용] 1:1 기준을 Product로 변경
  // 레시피와 제품(밀키트)의 관계는 1:1 관계
  @JoinColumn() // 1:1 관계에서, 기준이 되는 Column임을 표현
  @OneToOne(() => Recipe)
  @Field(() => Recipe)
  matchRecipe: Recipe;

  // M:N 은 서로 선언해야한다. productsTag.entity.ts 참조
  @JoinTable() // M:N 관계에서 기준이 되는 entity임을 표기. (선언 위치 무관)
  @ManyToMany(() => ProductsTag, (productsTags) => productsTags.products)
  @Field(() => [ProductsTag])
  productsTags: ProductsTag[];
}
