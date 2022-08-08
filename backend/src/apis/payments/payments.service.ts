import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async checkIsAbleToCancel({ impUid, user }) {
    // payment table에 결제 내역이 저장되어있는지 검증
    const paidPayment = await this.paymentsRepository.findOne({
      where: {
        impUid,
        user: { id: user.id },
        status: PAYMENT_STATUS_ENUM.PAYMENT,
      },
    });
    if (!paidPayment) {
      throw new UnprocessableEntityException(
        '기존 결제내역이 존재하지 않아 취소할 수 없습니다.',
      );
    }
    // payment table에 이미 취소 내역이 저장되어있는지 검증
    const canceledPayment = await this.paymentsRepository.findOne({
      where: { impUid, status: PAYMENT_STATUS_ENUM.CANCEL },
    });
    if (canceledPayment) {
      throw new UnprocessableEntityException('이미 취소된 결제입니다.');
    }
  }

  // 결제내역 (payment 생성)
  async create({ impUid, paymentTotal, user, status }) {
    // 1. 결제내역 테이블(Payment)에서, 기존 내역 확인
    const checkPayment = await this.paymentsRepository.findOne({
      where: { impUid, status },
    });

    // 1-1. 이미 저장된 결제/취소내역이라면, 오류메시지 전달
    if (checkPayment) {
      if (status === PAYMENT_STATUS_ENUM.PAYMENT)
        throw new ConflictException('이미 저장된 결제내역입니다.');
      if (status === PAYMENT_STATUS_ENUM.CANCEL)
        throw new ConflictException('이미 저장된 취소내역입니다.');
    }

    // 2. 결제/취소 한 유저의 정보 찾아오기
    const buyer = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    // 3. 결제/취소 내역 테이블 (Payment) 에, 결제/취소 내역과 결제/취소 한 유저의 정보 연계하여 생성
    const payment = this.paymentsRepository.create({
      impUid,
      paymentTotal,
      user: buyer,
      status,
    });

    // 4. 생성한 정보 저장하기
    const result = await this.paymentsRepository.save(payment);

    // 5. 결제/취소 내역 결과 프론트엔드에 돌려주기
    return result;
  }
}
