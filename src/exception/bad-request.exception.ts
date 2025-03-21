import { BadRequest } from 'http-errors';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(customMessage?: string | string[]) {
    const { statusCode, message: error } = BadRequest();
    super(statusCode, error, customMessage);
  }
}
