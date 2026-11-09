import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(
    private studentsService: StudentsService,
  ) {}

  // Get all students (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.studentsService.getAll();
  }

  // Get single student by ID (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.studentsService.findById(+id);
  }

  // Create student (open - for demo)
  @Post()
  async create(
    @Body() body: {
      first_name: string;
      last_name: string;
      age?: number;
      course?: string;
      year_level?: number;
      department_id?: number;
    },
  ) {
    return this.studentsService.createStudent(body);
  }

  // Update student (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.studentsService.updateStudent(+id, body);
  }

  // Delete student (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.deleteStudent(+id);
  }
}
