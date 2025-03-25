import { BadRequest } from 'http-errors';
import { HttpException } from '@exception';

export class BadRequestException extends HttpException {
  constructor(message?: string | string[]) {
    const { statusCode, message: error } = BadRequest();
    super(statusCode, error, message);
  }
}
