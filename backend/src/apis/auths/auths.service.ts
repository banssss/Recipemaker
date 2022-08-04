import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService, //
  ) {}

  // Refresh Token 생성 -> response header 에 넣어주는 과정
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );

    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포환경 - path 와 domain 설정, Secure - https / httpOnly - http
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`);
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  // Access Token 생성 - secret키와 expire주기 설정
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }

  // Social Login on Google, Naver, Kakao
  async socialLoginGNK({ req, res }) {
    // 1. 가입확인
    let user = await this.usersService.findOne({ userMail: req.user.email });

    // 2. 가입되어있지 않다면, 회원가입
    if (!user) {
      // 2-1. Social Login 은 password 를 받지 않기에 비밀번호 무작위 값 입력(임시처리. 수정예정)
      user = await this.usersService.create({
        createUserInput: { ...req.user },
      });
    }
    // 3. 로그인 (AccessToken 만들어서 프론트에 주기)
    this.setRefreshToken({ user, res });
    // res.redirect(process.env.LOGIN_REDIRECT_URL);
    res.redirect(
      'http://localhost:5500/codecamp-backend-04/main-project/frontend/login/index.html',
    ); // for code review
  }
}
