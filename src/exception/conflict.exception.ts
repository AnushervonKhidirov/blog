import { Conflict } from 'http-errors';
import { HttpException } from './http.exception';

export class ConflictException extends HttpException {
  constructor(customMessage?: string | string[]) {
    const { statusCode, message: error } = Conflict();
    super(statusCode, error, customMessage);
  }
}
