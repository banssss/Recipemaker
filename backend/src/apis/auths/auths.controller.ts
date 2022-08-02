import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthsService } from './auths.service';
import { Request, Response } from 'express';
import { IOAuthUser } from 'src/commons/type/authUser';

@Controller()
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService, //
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLoginGNK({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLoginGNK({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLoginGNK({ req, res });
  }
}
