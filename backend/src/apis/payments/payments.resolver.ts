import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { PAYMENT_STATUS_ENUM } from 'src/commons/type/enums';
import { IamportsService } from '../iamports/iamports.service';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService, //
    private readonly iamportsService: IamportsService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'paymentTotal', type: () => Int }) paymentTotal: number,
    @Context() context: IContext,
  ) {
    /***   결제 검증 시작   ***/

    // 1. 아임포트 억세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();

    // 2. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken.data.response.access_token,
      imp_uid: impUid,
    });

    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;

    // 3. 결제정보의 결제금액과 요청받은 결제금액 검증하기
    if (paymentTotal !== paymentData.amount) {
      throw new UnprocessableEntityException(
        '결제정보의 위조/변조 시도가 발견되었습니다. 요청하신 정보를 저장할 수 없습니다.',
      );
    }

    /***   결제 검증 종료   ***/

    // 결제 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 내역 저장
    const user = context.req.user;
    return this.paymentsService.create({
      impUid,
      paymentTotal,
      user,
      status: PAYMENT_STATUS_ENUM.PAYMENT,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Context() context: IContext,
  ) {
    /***   취소 검증 시작   ***/

    // 1. 입력받은 impUid 값을 통해 payment table에서 data 찾아오기.
    const payment = await this.paymentsService.findOne({ impUid });

    // 1-1. table 에 저장된 데이터가 조회되지 않을 때,
    if (!payment) {
      throw new UnprocessableEntityException(
        '요청하신 정보에 해당되는 결제데이터가 없습니다.',
      );
    }
    // 1-2. 이미 취소 된 결제인지 status 검증.
    if (payment.status === PAYMENT_STATUS_ENUM.CANCEL) {
      throw new UnprocessableEntityException('이미 취소된 결제입니다.');
    }

    // 2. 아임포트 억세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();

    // 3. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken.data.response.access_token,
      imp_uid: impUid,
    });

    /***   취소 검증 종료   ***/

    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;

    /*** 부분환불을 위한 전처리(아임포트 Docs 참조) ***/
    // 3-1. 조회한 결제정보로부터 imp_uid, amount(결제금액), cancel_amount(환불된 총 금액) 추출
    const { amount, cancel_amount } = paymentData;
    // 3-2. 환불 가능 금액 (= 결제금액 - 환불 된 총 금액) 계산
    const cancelableAmount = amount - cancel_amount;
    if (cancelableAmount <= 0) {
      // 이미 전액 환불된 경우
      return new UnprocessableEntityException('이미 전액 환불된 주문입니다.');
    }
    /*** 부분환불을 위한 전처리 끝 ***/

    // 4. 아임포트 서버에서 결제 취소 api 요청
    const canceledPayment = await this.iamportsService.cancelImpPaymentData({
      access_token: impToken.data.response.access_token,
      reason: '이곳에 환불사유를 입력해주세요',
      imp_uid: impUid,
      cancel_request_amount: amount, // 부분환불은 테스트모드에서 지원하지 않았습니다....!
      cancelableAmount, // 부분환불은 테스트모드에서 지원하지 않았습니다....!
    });

    console.log(canceledPayment); // 취소내역 출력 테스트

    // 결제 취소 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 취소 내역 저장
    const user = context.req.user;
    return this.paymentsService.create({
      impUid,
      paymentTotal: -amount,
      user,
      status: PAYMENT_STATUS_ENUM.CANCEL,
    });
  }
}
