import type { JwtPayload } from 'jsonwebtoken';
import type { ReturnWithErr, ReturnPromiseWithErr } from '@type/return-with-err.type';
import type { Token as UserToken } from '@prisma/client';
import type { Token, DecodedToken } from './token.type';

import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { logger } from '@config/logger/logger';
import { UnauthorizedException, InternalServerErrorException } from '@exception';
import { SignOutDto } from '../auth/dto/sign-out.dto';

export class TokenService {
  private readonly repository = new PrismaClient().token;
  private readonly accessSecret = process.env.ACCESS_TOKEN_SECRET;
  private readonly refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  generate(payload: JwtPayload): ReturnWithErr<Token> {
    try {
      if (!this.accessSecret || !this.refreshSecret) {
        throw new Error("Can't get access or refresh secret key");
      }

      const accessToken = sign(payload, this.accessSecret, { expiresIn: '10m' });
      const refreshToken = sign(payload, this.refreshSecret, { expiresIn: '10h' });

      return [{ accessToken, refreshToken }, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async save(data: Omit<UserToken, 'expiredAt'>): ReturnPromiseWithErr<UserToken> {
    try {
      const expiredAt = new Date();
      expiredAt.setHours(expiredAt.getHours() + 10);

      const userToken = await this.repository.create({ data: { ...data, expiredAt } });
      if (!userToken) return [null, new InternalServerErrorException('Unable to save token')];
      return [userToken, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async delete({ refreshToken }: SignOutDto): ReturnPromiseWithErr<UserToken> {
    try {
      const token = await this.repository.delete({ where: { refreshToken } });
      if (!token) return [null, new UnauthorizedException()];
      return [token, null];
    } catch (err) {
      logger.error(err);
      return [null, new UnauthorizedException()];
    }
  }

  verify({ accessToken, refreshToken }: Partial<Token>): ReturnWithErr<DecodedToken> {
    const decoded: DecodedToken = {
      accessToken: null,
      refreshToken: null,
    };

    try {
      if (!this.accessSecret || !this.refreshSecret) {
        throw new Error("Can't get access or refresh secret key");
      }

      if (!accessToken && !refreshToken) {
        throw new Error('Token was not provided');
      }

      if (accessToken) {
        decoded.accessToken = verify(accessToken, this.accessSecret);
      }

      if (refreshToken) {
        decoded.refreshToken = verify(refreshToken, this.refreshSecret);
      }

      return [decoded, null];
    } catch (err) {
      logger.error(err);
      return [null, new UnauthorizedException()];
    }
  }
}
