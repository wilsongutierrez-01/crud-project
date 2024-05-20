import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const createdTodo = new this.todoModel(createTodoDto);
      return await createdTodo.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      return await this.todoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Todo> {
    try {
      const todo = await this.todoModel.findOne({ id }).exec();
      if (!todo) {
        throw new NotFoundException(`This ID #${id} does not exist`);
      }
      return todo;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      const existingTodo = await this.todoModel.findOneAndUpdate({ id }, updateTodoDto, { new: true }).exec();
      if (!existingTodo) {
        throw new NotFoundException(`This ID #${id} does not exist`);
      }
      return existingTodo;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.todoModel.deleteOne({ id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`This ID #${id} does not exist`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
