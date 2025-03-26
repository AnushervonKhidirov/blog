import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import responseError from '@helper/response-error.helper';
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
    try {
      const [createUserDto, validationErr] = validate<CreateUserDto>(
        CreateUserValidation,
        req.body,
      );
      if (validationErr) throw validationErr;

      const [token, err] = await this.authService.signUp(createUserDto);
      if (err) throw err;

      res.status(200).send(token);
    } catch (err) {
      responseError(err, res);
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const [signInDto, validationErr] = validate<SignInDto>(SignInValidation, req.body);
      if (validationErr) throw validationErr;

      const [token, err] = await this.authService.signIn(signInDto);
      if (err) throw err;

      res.status(200).send(token);
    } catch (err) {
      responseError(err, res);
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      const [signOutDto, validationErr] = validate<SignOutDto>(SignOutValidation, req.body);
      if (validationErr) throw validationErr;

      const [_, err] = await this.authService.signOut(signOutDto);
      if (err) throw err;

      res.status(200).send();
    } catch (err) {
      responseError(err, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const [refreshTokenDto, validationErr] = validate<RefreshTokenDto>(
        RefreshTokenValidation,
        req.body,
      );
      if (validationErr) throw validationErr;

      const [token, err] = await this.authService.refreshToken(refreshTokenDto);
      if (err) throw err;

      res.status(200).send(token);
    } catch (err) {
      responseError(err, res);
    }
  }
}
