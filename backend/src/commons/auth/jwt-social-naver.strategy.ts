import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      // callbackURL: process.env.NAVER_CALLBACK_URL,
      callbackURL: 'http://localhost:3000/login/naver', // For code review
    });
  }

  validate(_, __, profile) {
    console.log(profile, '  &&   profile');
    return {
      userAccount: profile._json.email,
      email: profile._json.email,
      password: '1.41421356', // 패스워드 임시처리
      name: profile.displayName,
      nickname: profile._json.nickname,
      phone: '010-1234-5678', // 전화번호값 임시처리
    };
  }
}
