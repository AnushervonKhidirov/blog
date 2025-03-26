import { Router } from 'express';
import { PostController } from './post.controller';

export const PostRouter = Router();

const postController = new PostController();

PostRouter.get('/', postController.findMany.bind(postController));
PostRouter.get('/:id', postController.findOne.bind(postController));
PostRouter.post('/', postController.create.bind(postController));
PostRouter.patch('/:id', postController.update.bind(postController));
PostRouter.delete('/:id', postController.delete.bind(postController));
