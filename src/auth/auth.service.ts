import type { JwtPayload } from 'jsonwebtoken';
import type { ReturnPromiseWithErr } from '@type/return-with-err.type';
import type { Token } from '../token/token.type';

import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

export class AuthService {
  tokenService = new TokenService();
  userService = new UserService();

  async signUp(createUserDto: CreateUserDto): ReturnPromiseWithErr<Token> {
    const [user, err] = await this.userService.create(createUserDto);
    if (err) return [null, err];

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

  async signIn() {}

  async signOut() {}
}
