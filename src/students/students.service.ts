import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) { }

  private pool = () => this.db.getPool();

  async createStudent(data: {
    first_name: string;
    last_name: string;
    age?: number;
    course?: string;
    year_level?: number;
    department_id?: number;
  }) {
    try {
      const [result] =
        await this.pool().execute<OkPacket>(
          'INSERT INTO students (first_name, last_name, age, course, year_level, department_id) VALUES (?, ?, ?, ?, ?, ?)',
          [
            data.first_name,
            data.last_name,
            data.age ?? null,
            data.course ?? null,
            data.year_level ?? null,
            data.department_id ?? null,
          ],
        );

      return {
        student_id: result.insertId,
        ...data,
      };
    } catch (err: any) {
      if (err.errno === 1452) {
        throw new BadRequestException(
          'department_id does not exist',
        );
      }
      throw err;
    }
  }

  async getAll() {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        `SELECT s.*, d.department_name
         FROM students s
         LEFT JOIN departments d
           ON s.department_id = d.department_id`,
      );

    return rows;
  }

  async findById(id: number) {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        `SELECT s.*, d.department_name
         FROM students s
         LEFT JOIN departments d
           ON s.department_id = d.department_id
         WHERE s.student_id = ?`,
        [id],
      );

    return rows[0];
  }

  async updateStudent(
    id: number,
    partial: {
      first_name?: string;
      last_name?: string;
      age?: number;
      course?: string;
      year_level?: number;
      department_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.first_name) {
      fields.push('first_name = ?');
      values.push(partial.first_name);
    }
    if (partial.last_name) {
      fields.push('last_name = ?');
      values.push(partial.last_name);
    }
    if (partial.age) {
      fields.push('age = ?');
      values.push(partial.age);
    }
    if (partial.course) {
      fields.push('course = ?');
      values.push(partial.course);
    }
    if (partial.year_level) {
      fields.push('year_level = ?');
      values.push(partial.year_level);
    }
    if (partial.department_id) {
      fields.push('department_id = ?');
      values.push(partial.department_id);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);

    const sql =
      `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteStudent(id: number) {
    const [res] =
      await this.pool().execute<OkPacket>(
        'DELETE FROM students WHERE student_id = ?',
        [id],
      );

    return res.affectedRows > 0;
  }
}
