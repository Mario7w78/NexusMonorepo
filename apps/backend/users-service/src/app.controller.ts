// apps/backend/users-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller()
export class AppController {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: any) {
    const newUser = this.userRepo.create(data);
    return await this.userRepo.save(newUser);
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(@Payload() id: string) {
    return await this.userRepo.findOneBy({ id });
  }
}