import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { PAYMENT_STATUS_ENUM } from 'src/commons/type/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// graphql 에 enum type 등록
registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});
@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 아임포트 Uid
  @Column()
  @Field(() => String)
  impUid: string;

  // 결제 상태값
  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string;

  // // 결제 수량 - 맞는 데이터인가..? 고려중
  // @Column({ type: 'smallint', width: 10 })
  // @Field(() => Int)
  // paymentAmount: number;

  // 결제 방법 - 향후 카드정보 저장?
  // @Column('varchar', { length: 100 })
  // @Field(() => String)
  // paymentMethod: string;

  // 결제 총액
  @Column({ type: 'int', width: 10 })
  @Field(() => Int)
  paymentTotal: number;

  // 생성일자
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // 결제내역과 제품(밀키트)의 관계는 N:1 관계.
  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;

  // 결제내역과 유저의 관계는 N:1 관계.
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
