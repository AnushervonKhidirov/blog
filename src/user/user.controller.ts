import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Validator } from '../common/validator/validator';
import { BadRequestException } from '../exception/bad-request.exception';

export class UserController {
  private readonly service: UserService;

  constructor() {
    this.service = new UserService();
  }

  async findOne(req: Request, res: Response) {
    const { errors } = new Validator(req.params.id, 'id').IsNumericalString().IsNotEmpty();

    if (errors.length) {
      const exception = new BadRequestException(errors);
      res.status(exception.statusCode).send(exception);
      return;
    }

    const [user, err] = await this.service.findOne({ id: +req.params.id });

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(user);
  }

  async findAll(_: Request, res: Response) {
    const [users, err] = await this.service.findAll();

    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(users);
  }
}
