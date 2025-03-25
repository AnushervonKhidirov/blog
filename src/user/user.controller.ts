import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import { paramId } from '@validation/schema/param.validation';
import { UserService } from './user.service';
import { CreateUserValidation, UpdateUserValidation } from './validation/user.validation';

import { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

export class UserController {
  private readonly userService = new UserService();

  async findOne(req: Request, res: Response) {
    const [params, validationErr] = validate<{ id: number }>(paramId, req.params);

    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [user, err] = await this.userService.findOne({ id: params.id });

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }
    res.status(200).send(user);
  }

  async findMany(req: Request, res: Response) {
    const [users, err] = await this.userService.findMany();

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(users);
  }

  async create(req: Request, res: Response) {
    const [createUserDto, validationErr] = validate<CreateUserDto>(CreateUserValidation, req.body);

    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [user, err] = await this.userService.create(createUserDto);

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(user);
  }

  async update(req: Request, res: Response) {
    const [params, paramErr] = validate<{ id: number }>(paramId, req.params);

    if (paramErr) {
      res.status(paramErr.statusCode).send(paramErr);
      return;
    }

    const [updateUserDto, validationErr] = validate<UpdateUserDto>(UpdateUserValidation, req.body);

    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [user, err] = await this.userService.update(params.id, updateUserDto);

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(user);
  }

  async delete(req: Request, res: Response) {
    const [params, paramErr] = validate<{ id: number }>(paramId, req.params);

    if (paramErr) {
      res.status(paramErr.statusCode).send(paramErr);
      return;
    }

    const [user, err] = await this.userService.delete(params.id);

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(user);
  }
}
