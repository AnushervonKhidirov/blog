import { NotFound } from 'http-errors';
import { HttpException } from '@exception';

export class NotFoundException extends HttpException {
  constructor(message?: string | string[]) {
    const { statusCode, message: error } = NotFound();
    super(statusCode, error, message);
  }
}
