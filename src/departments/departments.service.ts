import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) { }

  private pool = () => this.db.getPool();

  async createDepartment(data: {
    department_name: string;
    building?: string;
    room_number?: string;
    department_head?: string;
  }) {
    const [result] =
      await this.pool().execute<OkPacket>(
        'INSERT INTO departments (department_name, building, room_number, department_head) VALUES (?, ?, ?, ?)',
        [
          data.department_name,
          data.building ?? null,
          data.room_number ?? null,
          data.department_head ?? null,
        ],
      );

    return {
      department_id: result.insertId,
      ...data,
    };
  }

  async getAll() {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        'SELECT * FROM departments',
      );

    return rows;
  }

  async findById(id: number) {
    const [rows] =
      await this.pool().execute<RowDataPacket[]>(
        'SELECT * FROM departments WHERE department_id = ?',
        [id],
      );

    return rows[0];
  }

  async updateDepartment(
    id: number,
    partial: {
      department_name?: string;
      building?: string;
      room_number?: string;
      department_head?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.department_name) {
      fields.push('department_name = ?');
      values.push(partial.department_name);
    }
    if (partial.building) {
      fields.push('building = ?');
      values.push(partial.building);
    }
    if (partial.room_number) {
      fields.push('room_number = ?');
      values.push(partial.room_number);
    }
    if (partial.department_head) {
      fields.push('department_head = ?');
      values.push(partial.department_head);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);

    const sql =
      `UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteDepartment(id: number) {
    const [res] =
      await this.pool().execute<OkPacket>(
        'DELETE FROM departments WHERE department_id = ?',
        [id],
      );

    return res.affectedRows > 0;
  }
}
