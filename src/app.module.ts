import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { StudentsModule } from './students/students.module';
import { TasksModule } from './tasks/task.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, DepartmentsModule, StudentsModule, TasksModule]
})
export class AppModule { }
