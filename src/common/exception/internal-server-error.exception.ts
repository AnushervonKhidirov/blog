import { InternalServerError } from 'http-errors';
import { HttpException } from '@exception';

export class InternalServerErrorException extends HttpException {
  constructor(message?: string | string[]) {
    const { statusCode, message: error } = InternalServerError();
    super(statusCode, error, message);
  }
}
