import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './shemas/user.shema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: any): Promise<User> {
    return this.userService.create(userDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: any): Promise<User> {
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}