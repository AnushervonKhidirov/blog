import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserValidation } from '../user/validation/user.validation';
import {
  SignInValidation,
  SignOutValidation,
  RefreshTokenValidation,
} from './validation/auth.validation';

export class AuthController {
  authService = new AuthService();

  async signUp(req: Request, res: Response) {
    const [createUserDto, validationErr] = validate<CreateUserDto>(CreateUserValidation, req.body);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [token, err] = await this.authService.signUp(createUserDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(token);
  }

  async signIn(req: Request, res: Response) {
    const [signInDto, validationErr] = validate<SignInDto>(SignInValidation, req.body);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [token, err] = await this.authService.signIn(signInDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(token);
  }

  async signOut(req: Request, res: Response) {
    const [signOutDto, validationErr] = validate<SignOutDto>(SignOutValidation, req.body);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [_, err] = await this.authService.signOut(signOutDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send();
  }

  async refreshToken(req: Request, res: Response) {
    const [refreshTokenDto, validationErr] = validate<RefreshTokenDto>(
      RefreshTokenValidation,
      req.body,
    );
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [token, err] = await this.authService.refreshToken(refreshTokenDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(token);
  }
}
