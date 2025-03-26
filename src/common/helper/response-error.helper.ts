import type { Response } from 'express';
import { HttpException, InternalServerErrorException } from '@exception';

export default function responseError(err: unknown, res: Response) {
  const error = err instanceof HttpException ? err : new InternalServerErrorException();
  res.status(error.statusCode).send(error);
}
