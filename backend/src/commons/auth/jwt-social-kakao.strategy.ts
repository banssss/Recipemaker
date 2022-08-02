import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      // callbackURL: process.env.KAKAO_CALLBACK_URL,
      callbackURL: 'http://localhost:3000/login/kakao', // For code review
    });
  }

  validate(_, __, profile) {
    console.log(profile, '  &&   profile');
    return {
      userAccount: profile._json.kakao_account.email,
      email: profile._json.kakao_account.email,
      password: '1.41421356', // 패스워드 임시처리
      name: profile._json.properties.nickname,
      nickname: profile._json.properties.nickname,
      phone: '010-1234-5678', // 전화번호값 임시처리
    };
  }
}
