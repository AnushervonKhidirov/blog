import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import { paramId } from '@validation/schema/param.validation';
import responseError from '@helper/response-error.helper';
import { UserService } from './user.service';
import { UpdateUserValidation } from './validation/user.validation';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserController {
  private readonly userService = new UserService();

  async findOne(req: Request, res: Response) {
    try {
      const [params, validationErr] = validate<{ id: number }>(paramId, req.params);
      if (validationErr) throw validationErr;

      const [user, err] = await this.userService.findOne({ id: params.id });
      if (err) throw err;

      res.status(200).send(user);
    } catch (err) {
      responseError(err, res);
    }
  }

  async findMany(req: Request, res: Response) {
    try {
      const [users, err] = await this.userService.findMany();
      if (err) throw err;
      res.status(200).send(users);
    } catch (err) {
      responseError(err, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const [params, paramErr] = validate<{ id: number }>(paramId, req.params);
      if (paramErr) throw paramErr;

      const [updateUserDto, validationErr] = validate<UpdateUserDto>(
        UpdateUserValidation,
        req.body,
      );

      if (validationErr) throw validationErr;

      const [user, err] = await this.userService.update(params.id, updateUserDto);
      if (err) throw err;

      res.status(200).send(user);
    } catch (err) {
      responseError(err, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const [params, paramErr] = validate<{ id: number }>(paramId, req.params);
      if (paramErr) throw paramErr;

      const [user, err] = await this.userService.delete(params.id);
      if (err) throw err;

      res.status(200).send(user);
    } catch (err) {
      responseError(err, res);
    }
  }
}
