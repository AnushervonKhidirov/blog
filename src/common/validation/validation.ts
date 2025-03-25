import type { ObjectSchema } from 'joi';
import type { ReturnWithErr } from '@type/return-with-err.type';
import { BadRequestException } from '@exception';

export function validate<T>(schema: ObjectSchema, data: unknown): ReturnWithErr<T> {
  const { error, value } = schema.options({ abortEarly: false }).validate(data);

  if (error) {
    const errors = error.message.replaceAll(`"`, `'`).split('. ');
    return [null, new BadRequestException(errors)];
  }

  return [value, null];
}
