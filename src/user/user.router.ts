import { Router } from 'express';
import { UserController } from './user.controller';

export const UserRouter = Router();

const userController = new UserController();

UserRouter.get('/', userController.findMany.bind(userController));
UserRouter.get('/:id', userController.findOne.bind(userController));
UserRouter.patch('/:id', userController.update.bind(userController));
UserRouter.delete('/:id', userController.delete.bind(userController));
