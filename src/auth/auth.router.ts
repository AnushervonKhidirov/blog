import { Router } from 'express';
import { AuthController } from './auth.controller';

export const AuthRouter = Router();

const authController = new AuthController();

AuthRouter.post('/sign-up', authController.signUp.bind(authController));
AuthRouter.post('/sign-in', authController.signIn.bind(authController));
AuthRouter.post('/sign-out', authController.signOut.bind(authController));
