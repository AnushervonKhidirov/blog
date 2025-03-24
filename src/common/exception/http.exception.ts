export class HttpException {
  statusCode: number;
  error: string;
  message?: string | string[];

  constructor(statusCode: number, error: string, message?: string | string[]) {
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
  }
}
