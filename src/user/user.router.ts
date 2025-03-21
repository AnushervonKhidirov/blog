import { Router } from 'express';
import { UserController } from './user.controller.js';

export class UserRouter {
  readonly router: Router;
  private readonly controller: UserController;

  constructor() {
    this.controller = new UserController();
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get('/', this.controller.findAll.bind(this.controller));

    this.router.get('/:id', this.controller.findOne.bind(this.controller));
  }
}
