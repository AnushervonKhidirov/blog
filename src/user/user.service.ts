import type { User } from './user.type';
import type { ValueErrorReturnPromise } from '../common/type/value-error-return.type';

import { ResultSetHeader } from 'mysql2';
import { db } from '../database/database';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException, InternalServerErrorException } from '../exception/exception';
import { QueryGenerator } from '../database/query.helper';
import { ConflictException } from '../exception/conflict.exception';

export class UserService {
  private readonly table = 'users';
  private readonly queryGenerator = new QueryGenerator<User>(this.table);

  constructor() {
    this.createTable();
  }

  private createTable() {
    db.query(`CREATE TABLE IF NOT EXISTS ${this.table} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );`);
  }

  async findOne(where: Partial<User>): ValueErrorReturnPromise<User> {
    try {
      const [result] = await db.query(...this.queryGenerator.select(where));
      const users = <User[]>result;

      if (!users.length) return [null, new NotFoundException('User not found')];
      return [users[0], null];
    } catch (_) {
      return [null, new InternalServerErrorException()];
    }
  }

  async findAll(): ValueErrorReturnPromise<User[]> {
    try {
      const [result] = await db.query(...this.queryGenerator.select());
      const users = <User[]>result;

      return [users, null];
    } catch (err) {
      return [null, new InternalServerErrorException()];
    }
  }

  async create(createUserDto: CreateUserDto): ValueErrorReturnPromise<User> {
    try {
      const [isExist] = await this.findOne({ email: createUserDto.email });
      if (isExist) {
        return [
          null,
          new ConflictException(`User with email '${createUserDto.email}' already exists`),
        ];
      }

      const [result] = await db.query<ResultSetHeader>(
        ...this.queryGenerator.insert(createUserDto),
      );

      const [user, err] = await this.findOne({ id: result.insertId });

      if (err) return [null, err];
      return [user, null];
    } catch (_) {
      return [null, new InternalServerErrorException()];
    }
  }
}
