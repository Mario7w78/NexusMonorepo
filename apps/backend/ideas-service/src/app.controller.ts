// apps/backend/ideas-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Idea } from './idea.schema';

@Controller()
export class AppController {
  constructor(@InjectModel(Idea.name) private ideaModel: Model<Idea>) {}

  @MessagePattern({ cmd: 'create_idea' })
  async create(@Payload() data: any) {
    const createdIdea = new this.ideaModel(data);
    return createdIdea.save();
  }

  @MessagePattern({ cmd: 'get_ideas' })
  async findAll() {
    return this.ideaModel.find().exec();
  }
}