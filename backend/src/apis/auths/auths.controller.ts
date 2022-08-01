import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthsService } from './auths.service';
import { Request, Response } from 'express';
import { IOAuthUser } from 'src/commons/type/authUser';

@Controller()
export class AuthsController {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authsService: AuthsService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    // 1. 가입확인
    let user = await this.usersService.findOne({ userMail: req.user.email });

    // 2. 회원가입
    if (!user) {
      // 2-1. Social Login 은 password 를 받지 않기에 비밀번호 무작위 값 입력(임시처리. 수정예정)
      user = await this.usersService.create({
        createUserInput: { ...req.user },
      });
    }
    // 3. 로그인 (AccessToken 만들어서 프론트에 주기)
    this.authsService.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/codecamp-backend-04/main-project/frontend/login/index.html',
    );
  }
}
