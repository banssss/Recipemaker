import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'smallint', width: 10 })
  @Field(() => Int)
  paymentAmount: number;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  paymentMethod: string;

  @Column({ type: 'mediumint', width: 10 })
  @Field(() => Int)
  paymentTotal: number;

  @Column({ type: 'date' })
  @Field(() => Date)
  paymentDate: Date;

  // 구매내역과 제품(밀키트)의 관계는 N:1 관계.
  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;

  // 구매내역과 유저의 관계는 N:1 관계.
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
