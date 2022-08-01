import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductsTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('varchar', { length: 100, unique: true })
  @Field(() => String)
  name: string;

  // M:N 은 서로 선언해야한다. product.entity.ts 참조
  @ManyToMany(() => Product, (products) => products.productsTags)
  @Field(() => [Product])
  products: Product[];
}
