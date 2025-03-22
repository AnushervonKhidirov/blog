import type { Token } from './jwt.type';
import type { User } from '../user/user.type';
import type { ValueErrorReturn } from '../common/type/value-error-return.type';

import { sign } from 'jsonwebtoken';
import { InternalServerErrorException } from '../exception/internal-server-error.exception';

export class JwtService {
  accessKey = process.env.ACCESS_TOKEN_KEY;
  refreshKey = process.env.REFRESH_TOKEN_KEY;

  generate(user: User): ValueErrorReturn<Token> {
    if (!this.accessKey || !this.refreshKey) return [null, new InternalServerErrorException()];
    const accessToken = sign({ userId: user.id, email: user.email }, this.accessKey, {
      expiresIn: '10m',
    });
    const refreshToken = sign({ userId: user.id, email: user.email }, this.refreshKey, {
      expiresIn: '10h',
    });

    return [{ accessToken, refreshToken }, null];
  }
}
