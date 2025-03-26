import type { Request, Response } from 'express';

import { validate } from '@validation/validation';
import { paramId, paramUserId } from '@validation/schema/param.validation';
import responseError from '@helper/response-error.helper';
import { CreatePostValidation, UpdatePostValidation } from './validation/user.validation';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UnauthorizedException } from '@exception';
import { PostService } from './post.service';

export class PostController {
  service = new PostService();

  async findOne(req: Request, res: Response) {
    try {
      const [params, validationErr] = validate<{ id: number }>(paramId, req.params);
      if (validationErr) throw validationErr;

      const [post, err] = await this.service.findOne({ id: params.id }, true);
      if (err) throw err;

      res.status(200).send(post);
    } catch (err) {
      responseError(err, res);
    }
  }

  async findMany(req: Request, res: Response) {
    try {
      const [params, validationErr] = validate<{ userId: number }>(paramUserId, req.query);
      if (validationErr) throw validationErr;

      const [posts, err] = await this.service.findMany(params, true);
      if (err) throw err;

      res.status(200).send(posts);
    } catch (err) {
      responseError(err, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      if (!req['userId']) throw new UnauthorizedException();

      const userId = parseInt(req['userId']);

      const [createPostDto, validationErr] = validate<CreatePostDto>(
        CreatePostValidation,
        req.body,
      );

      if (validationErr) throw validationErr;

      const [post, err] = await this.service.create(userId, createPostDto);
      if (err) throw err;

      res.status(200).send(post);
    } catch (err) {
      responseError(err, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req['userId']) throw new UnauthorizedException();

      const userId = parseInt(req['userId']);

      const [params, paramsErr] = validate<{ id: number }>(paramId, req.params);
      if (paramsErr) throw paramsErr;

      const [updatePostDto, validationErr] = validate<UpdatePostDto>(
        UpdatePostValidation,
        req.body,
      );
      if (validationErr) throw validationErr;

      const [post, err] = await this.service.update(userId, params.id, updatePostDto);
      if (err) throw err;

      res.status(200).send(post);
    } catch (err) {
      responseError(err, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req['userId']) throw new UnauthorizedException();

      const userId = parseInt(req['userId']);

      const [params, paramsErr] = validate<{ id: number }>(paramId, req.params);
      if (paramsErr) throw paramsErr;

      const [post, err] = await this.service.delete(userId, params.id);
      if (err) throw err;

      res.status(200).send(post);
    } catch (err) {
      responseError(err, res);
    }
  }
}
