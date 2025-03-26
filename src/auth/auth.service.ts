import type { JwtPayload } from 'jsonwebtoken';
import type { ReturnPromiseWithErr } from '@type/return-with-err.type';
import type { Token as UserToken } from '@prisma/client';
import type { Token } from '../token/token.type';
import type { UserWithoutPassword } from '../user/user.type';

import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { BadRequestException, UnauthorizedException } from '@exception';
import type { RefreshTokenDto } from './dto/refresh-token.dto';

export class AuthService {
  private readonly tokenService = new TokenService();
  private readonly userService = new UserService();

  async signUp(createUserDto: CreateUserDto): ReturnPromiseWithErr<Token> {
    const [user, err] = await this.userService.create(createUserDto);
    if (err) return [null, err];

    const [tokens, tokenErr] = await this.addToken(user);
    if (tokenErr) return [null, tokenErr];

    return [tokens, null];
  }

  async signIn(signInDto: SignInDto): ReturnPromiseWithErr<Token> {
    const [user, err] = await this.userService.findOneWithPassword({ email: signInDto.email });
    if (err) return [null, err];

    const isCorrectPassword = await Bun.password.verify(signInDto.password, user.password);
    if (!isCorrectPassword) return [null, new BadRequestException('Wrong password')];

    const [tokens, tokenErr] = await this.addToken(user);
    if (tokenErr) return [null, tokenErr];

    return [tokens, null];
  }

  async signOut(signOutDto: SignOutDto): ReturnPromiseWithErr<UserToken> {
    const [_, verifyErr] = this.tokenService.verify(signOutDto);
    if (verifyErr) return [null, verifyErr];

    const [token, err] = await this.tokenService.delete(signOutDto);
    if (err) return [null, err];
    return [token, null];
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): ReturnPromiseWithErr<Token> {
    const [decoded, verifyErr] = this.tokenService.verify(refreshTokenDto);
    if (verifyErr) return [null, verifyErr];

    if (!decoded.refreshToken || typeof decoded.refreshToken === 'string') {
      return [null, new UnauthorizedException()];
    }

    const [_, err] = await this.tokenService.delete(refreshTokenDto);
    if (err) return [null, err];

    const payload = <{ sub: string; email: string }>decoded.refreshToken;
    const [token, tokenErr] = await this.addToken({
      id: +payload.sub,
      email: payload.email,
    });

    if (tokenErr) return [null, tokenErr];
    return [token, null];
  }

  private async addToken(
    user: Pick<UserWithoutPassword, 'id' | 'email'>,
  ): ReturnPromiseWithErr<Token> {
    const tokenPayload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
    };

    const [tokens, tokenErr] = this.tokenService.generate(tokenPayload);
    if (tokenErr) return [null, tokenErr];

    const [_, saveTokenErr] = await this.tokenService.save({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    if (saveTokenErr) return [null, saveTokenErr];

    return [tokens, null];
  }
}
