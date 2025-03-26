import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import { paramId, paramUserId } from '@validation/schema/param.validation';
import { CreatePostValidation, UpdatePostValidation } from './validation/user.validation';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UnauthorizedException } from '@exception';
import { PostService } from './post.service';

export class PostController {
  service = new PostService();

  async findOne(req: Request, res: Response) {
    const [params, validationErr] = validate<{ id: number }>(paramId, req.params);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [post, err] = await this.service.findOne({ id: params.id }, true);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(post);
  }

  async findMany(req: Request, res: Response) {
    const [params, validationErr] = validate<{ userId: number }>(paramUserId, req.query);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [posts, err] = await this.service.findMany(params, true);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(posts);
  }

  async create(req: Request, res: Response) {
    if (!req['userId']) {
      const exception = new UnauthorizedException();
      res.status(exception.statusCode).send(exception);
      return;
    }

    const userId = parseInt(req['userId']);

    const [createPostDto, validationErr] = validate<CreatePostDto>(CreatePostValidation, req.body);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [post, err] = await this.service.create(userId, createPostDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(post);
  }

  async update(req: Request, res: Response) {
    if (!req['userId']) {
      const exception = new UnauthorizedException();
      res.status(exception.statusCode).send(exception);
      return;
    }

    const userId = parseInt(req['userId']);

    const [params, paramsErr] = validate<{ id: number }>(paramId, req.params);
    if (paramsErr) {
      res.status(paramsErr.statusCode).send(paramsErr);
      return;
    }

    const [updatePostDto, validationErr] = validate<UpdatePostDto>(UpdatePostValidation, req.body);
    if (validationErr) {
      res.status(validationErr.statusCode).send(validationErr);
      return;
    }

    const [post, err] = await this.service.update(userId, params.id, updatePostDto);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(post);
  }

  async delete(req: Request, res: Response) {
    if (!req['userId']) {
      const exception = new UnauthorizedException();
      res.status(exception.statusCode).send(exception);
      return;
    }

    const userId = parseInt(req['userId']);

    const [params, paramsErr] = validate<{ id: number }>(paramId, req.params);
    if (paramsErr) {
      res.status(paramsErr.statusCode).send(paramsErr);
      return;
    }

    const [post, err] = await this.service.delete(userId, params.id);
    if (err) {
      res.status(err.statusCode).send(err);
      return;
    }

    res.status(200).send(post);
  }
}
