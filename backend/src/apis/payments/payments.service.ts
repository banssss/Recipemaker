import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAYMENT_STATUS_ENUM } from 'src/commons/type/enums';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>, //

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 구매내역 (payment 생성)
  async create({ impUid, paymentTotal, user }) {
    // 1. 구매한 유저의 정보 찾아오기
    const buyer = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    // 2. 구매내역 테이블 (Payment) 에, 구매내역과 구매한 유저의 정보 연계하여 생성
    const payment = this.paymentsRepository.create({
      impUid,
      paymentTotal,
      user: buyer,
      status: PAYMENT_STATUS_ENUM.PAYMENT,
    });

    // 2-1. 생성한 정보 저장하기
    await this.paymentsRepository.save(payment);

    // 3. 구매내역 결과 프론트엔드에 돌려주기
    return payment;
  }
}
