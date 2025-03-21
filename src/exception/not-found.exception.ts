import { NotFound } from 'http-errors';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(customMessage?: string | string[]) {
    const { statusCode, message: error } = NotFound();
    super(statusCode, error, customMessage);
  }
}
