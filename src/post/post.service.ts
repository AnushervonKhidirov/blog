import type { ReturnPromiseWithErr } from '@type/return-with-err.type';
import type { Post } from '@prisma/client';

import { Prisma, PrismaClient } from '@prisma/client';
import { logger } from '@config/logger/logger';
import { InternalServerErrorException, NotFoundException } from '@exception';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export class PostService {
  repository = new PrismaClient().post;

  async findOne(
    where: Prisma.PostWhereUniqueInput,
    relation: boolean = false,
  ): ReturnPromiseWithErr<Post> {
    try {
      const post = await this.repository.findUnique({
        where,
        include: relation ? { user: { omit: { password: true } } } : null,
      });
      if (!post) return [null, new NotFoundException('Post not found')];
      return [post, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async findMany(
    where?: Prisma.PostWhereInput,
    relation: boolean = false,
  ): ReturnPromiseWithErr<Post[]> {
    try {
      const posts = await this.repository.findMany({
        where,
        include: relation ? { user: { omit: { password: true } } } : null,
      });
      return [posts, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async create(userId: number, createPostDto: CreatePostDto): ReturnPromiseWithErr<Post> {
    try {
      const post = await this.repository.create({ data: { ...createPostDto, userId } });
      return [post, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async update(
    userId: number,
    id: number,
    updatePostDto: UpdatePostDto,
  ): ReturnPromiseWithErr<Post> {
    try {
      const [_, err] = await this.findOne({ id, userId });
      if (err) return [null, err];

      const post = await this.repository.update({ data: updatePostDto, where: { id } });
      return [post, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async delete(userId: number, id: number): ReturnPromiseWithErr<Post> {
    try {
      const [_, err] = await this.findOne({ id, userId });
      if (err) return [null, err];

      const post = await this.repository.delete({ where: { id } });
      return [post, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }
}
