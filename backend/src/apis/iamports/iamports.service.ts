import {
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportsService {
  async getImpAccessToken() {
    try {
      const token = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IAMPORT_REST_API_KEY, // REST API키
          imp_secret: process.env.IAMPORT_REST_API_SECRET, // REST API Secret
        },
      });
      return token;
    } catch (e) {
      // 아임포트 서버에서 Access Token 발급에 실패했을 때
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }

  async getImpPaymentData({ access_token, imp_uid }) {
    try {
      const paymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      });
      return paymentData;
    } catch (e) {
      // 아임포트 서버에서 결제 정보를 가져올 수 없었을 때
      throw new UnprocessableEntityException(e.response.data.message);
      // throw new HttpException(e.response.data.message, e.response.status);
    }
  }

  /* 아임포트 REST API로 결제환불 요청 */
  async cancelImpPaymentData({
    access_token,
    reason,
    imp_uid,
    cancel_request_amount,
    cancelableAmount,
  }) {
    try {
      const getCancelData = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          reason, // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid, // imp_uid를 환불 `unique key`로 입력
          amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
          checksum: cancelableAmount, // [권장] 환불 가능 금액 입력
        },
      });
      const result = getCancelData.data; // 환불 결과
      return result;
    } catch (e) {
      // 아임포트 서버에서 환불 과정을 진행할 수 없을 때
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }
}
