import { InternalServerError } from 'http-errors';
import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(customMessage?: string | string[]) {
    const { statusCode, message: error } = InternalServerError();
    super(statusCode, error, customMessage);
  }
}
