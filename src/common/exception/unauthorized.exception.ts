import { Unauthorized } from 'http-errors';
import { HttpException } from '@exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: string | string[]) {
    const { statusCode, message: error } = Unauthorized();
    super(statusCode, error, message);
  }
}
