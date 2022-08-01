import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductsImg {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  productsImgUrl: string;

  // 제품이미지와 제품(밀키트)의 관계는 N:1
  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;
}
