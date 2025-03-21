import type { User } from './user.type';
import type { ValueErrorReturnPromise } from '../common/type/value-error-return.type';

import { db } from '../database/database';
import { NotFoundException } from '../exception/exception';

export class UserService {
  private readonly table = 'users';

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

  async findOne(id: number): ValueErrorReturnPromise<User> {
    const [result] = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    const users = <User[]>result;

    if (!users.length) return [null, new NotFoundException('User not found')];
    return [users[0], null];
  }

  async findAll(): ValueErrorReturnPromise<User[]> {
    const [result] = await db.query(`SELECT * FROM ${this.table}`);
    const users = <User[]>result;

    return [users, null];
  }
}
