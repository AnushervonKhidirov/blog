import { Conflict } from 'http-errors';
import { HttpException } from '@exception';

export class ConflictException extends HttpException {
  constructor(message?: string | string[]) {
    const { statusCode, message: error } = Conflict();
    super(statusCode, error, message);
  }
}
