import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserDtoValidation } from '../user/dto/create-user.dto';
import { BadRequestException } from '../exception/bad-request.exception';
import { SignInDto, SignInDtoValidation } from './dto/sign-in.dto';

export class AuthController {
  service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async SignIn(req: Request, res: Response) {
    const signInDto = new SignInDtoValidation(req.body).validate();

    if (!(signInDto instanceof SignInDto)) {
      const exception = new BadRequestException(signInDto);
      res.status(exception.statusCode).send(exception);
      return;
    }

    const [token, err] = await this.service.SignIn(signInDto);

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(token);
  }

  async SignUp(req: Request, res: Response) {
    const createUserDto = new CreateUserDtoValidation(req.body).validate();

    if (!(createUserDto instanceof CreateUserDto)) {
      const exception = new BadRequestException(createUserDto);
      res.status(exception.statusCode).send(exception);
      return;
    }

    const [token, err] = await this.service.SignUp(createUserDto);

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(token);
  }

  async SignOut(_: Request, res: Response) {}
}
