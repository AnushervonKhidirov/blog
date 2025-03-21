import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRouter {
  readonly router: Router;
  private readonly controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();

    this.init();
  }

  private init() {
    this.router.post('/signin', this.controller.SignIn.bind(this.controller));
    this.router.post('/signup', this.controller.SignUp.bind(this.controller));
    this.router.post('/signout', this.controller.SignOut.bind(this.controller));
  }
}
