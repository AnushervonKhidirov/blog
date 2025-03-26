import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@exception';
import responseError from '@helper/response-error.helper';
import { TokenService } from '../token/token.service';

export const AuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isAuthRout = req.url.replaceAll('/', ' ').trim().split(' ')[0] === 'auth';
    const isGetMethod = req.method === 'GET';

    if (isGetMethod || isAuthRout) return next();

    try {
      const tokenService = new TokenService();
      const headers = req.headers;
      if (!headers.authorization) throw new UnauthorizedException('Invalid token');

      const accessToken = headers.authorization.split(' ')[1];
      if (!accessToken) throw new UnauthorizedException('Invalid token');

      const [token, err] = tokenService.verify({ accessToken });
      if (err || !token.accessToken || typeof token.accessToken === 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      req['userId'] = token.accessToken.sub;

      next();
    } catch (err) {
      responseError(err, res);
    }
  };
};
