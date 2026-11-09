import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class TasksService {
  constructor(private db: DatabaseService) { }

  private pool = () => this.db.getPool();

  async createTask(
    title: string,
    description?: string,
  ) {
    const [result] =
      await this.pool().execute<OkPacket>(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description ?? null],
      );

    return this.findById(result.insertId);
  }

  async getAll() {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        'SELECT id, title, description, completed, created_at, updated_at FROM tasks ORDER BY id DESC',
      );

    return rows;
  }

  async findById(id: number) {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        'SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id = ?',
        [id],
      );

    const task = rows[0];

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async updateTask(
    id: number,
    partial: {
      title?: string;
      description?: string;
      completed?: boolean;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.title !== undefined) {
      fields.push('title = ?');
      values.push(partial.title);
    }

    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }

    if (partial.completed !== undefined) {
      fields.push('completed = ?');
      values.push(partial.completed);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql =
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;

    const [res] =
      await this.pool().execute<OkPacket>(sql, values);

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.findById(id);
  }

  async deleteTask(id: number) {
    const [res] =
      await this.pool().execute<OkPacket>(
        'DELETE FROM tasks WHERE id = ?',
        [id],
      );

    if (res.affectedRows === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return { deleted: true, id };
  }
}
