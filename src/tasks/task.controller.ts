import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { TasksService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
  ) {}

  // Get all tasks (public)
  @Get()
  async getAll() {
    return this.tasksService.getAll();
  }

  // Get single task by ID (public)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.tasksService.findById(+id);
  }

  // Create task (public)
  @Post()
  async create(
    @Body() body: {
      title: string;
      description?: string;
    },
  ) {
    return this.tasksService.createTask(
      body.title,
      body.description,
    );
  }

  // Update task (public)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      description?: string;
      completed?: boolean;
    },
  ) {
    return this.tasksService.updateTask(+id, body);
  }

  // Delete task (public)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(+id);
  }
}
