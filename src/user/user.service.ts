import { Prisma, PrismaClient } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-err.type';
import type { UserWithoutPassword } from './user.type';

import { NotFoundException, InternalServerErrorException, ConflictException } from '@exception';
import { logger } from '@config/logger/logger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserService {
  repository = new PrismaClient().user;

  async findOne(where: Prisma.UserWhereUniqueInput): ReturnPromiseWithErr<UserWithoutPassword> {
    try {
      const user = await this.repository.findUnique({ where, omit: { password: true } });
      if (!user) return [null, new NotFoundException('User not found')];
      return [user, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async findMany(where?: Prisma.UserWhereInput): ReturnPromiseWithErr<UserWithoutPassword[]> {
    try {
      const users = await this.repository.findMany({ where, omit: { password: true } });
      return [users, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async create(createUserDto: CreateUserDto): ReturnPromiseWithErr<UserWithoutPassword> {
    try {
      const [isExist] = await this.findOne({ email: createUserDto.email });

      if (isExist) {
        return [
          null,
          new ConflictException(`User with email: '${createUserDto.email} already exists'`),
        ];
      }

      const user = await this.repository.create({ data: createUserDto, omit: { password: true } });

      if (!user) {
        return [
          null,
          new InternalServerErrorException('Unable to create user, please try again later'),
        ];
      }

      return [user, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): ReturnPromiseWithErr<UserWithoutPassword> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) return [null, err];

      const user = await this.repository.update({
        data: updateUserDto,
        where: { id },
        omit: { password: true },
      });

      if (!user) {
        return [
          null,
          new InternalServerErrorException('Unable to update user, please try again later'),
        ];
      }

      return [user, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }

  async delete(id: number): ReturnPromiseWithErr<UserWithoutPassword> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) return [null, err];

      const user = await this.repository.delete({ where: { id }, omit: { password: true } });

      if (!user) {
        return [
          null,
          new InternalServerErrorException('Unable to update user, please try again later'),
        ];
      }

      return [user, null];
    } catch (err) {
      logger.error(err);
      return [null, new InternalServerErrorException()];
    }
  }
}
