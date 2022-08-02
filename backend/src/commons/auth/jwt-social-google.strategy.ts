import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: process.env.GOOGLE_CALLBACK_URL,
      callbackURL: 'http://localhost:3000/login/google', // For code review
      scope: ['email', 'profile'],
      // google api에서 허용한 부분들을 아래와 같이 추가 가능.
      // scope: [
      //   'https://www.googleapis.com/auth/userinfo.profile',
      //   'https://www.googleapis.com/auth/userinfo.email',
      // ],
    });
  }

  // validate 안의 arg 들이 변수명에 상관없이, 정해진 순서대로 들어오는것 확인. 자세한 부분은 추가 탐구가 필요합니다..
  validate(_, __, profile) {
    // console.log(_, '  ##  _');
    // console.log(__, '  ##  __');
    console.log(profile, '  &&   profile');
    return {
      userAccount: profile._json.email,
      email: profile._json.email,
      password: '1.41421356', // 패스워드 임시처리
      name: profile.displayName,
      nickname: profile._json.given_name,
      phone: '010-1234-5678', // 전화번호값 임시처리
    };
  }
}
