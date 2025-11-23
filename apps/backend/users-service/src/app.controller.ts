// apps/backend/users-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller()
export class AppController {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: any) {
    const newUser = this.userRepo.create(data);
    return await this.userRepo.save(newUser);
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(@Payload() id: string) {
    return await this.userRepo.findOneBy({ id });
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(@Payload() data: { id: string; updates: any }) {
    await this.userRepo.update(data.id, data.updates);
    return await this.userRepo.findOneBy({ id: data.id });
  }

  @MessagePattern({ cmd: 'get_user_stats' })
  async getUserStats(@Payload() id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return null;

    return {
      projectsCreated: user.projectsCreated,
      projectsCollaborated: user.projectsCollaborated,
      rating: user.rating,
      totalEarnings: user.totalEarnings
    };
  }

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() data: { fullName: string; email: string; password: string; specialty: string }) {
    // Check if user exists
    const existing = await this.userRepo.findOneBy({ email: data.email });
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    // Create user (password stored as plain text for now - NOT production ready)
    const newUser = this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      specialty: data.specialty,
      passwordHash: data.password, // Mock: should be hashed in production
      avatar: data.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    });

    const saved = await this.userRepo.save(newUser);
    return { success: true, user: saved };
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() data: { email: string; password: string }) {
    const user = await this.userRepo.findOneBy({ email: data.email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Mock password check (NOT production ready)
    if (user.passwordHash !== data.password) {
      return { success: false, message: 'Invalid password' };
    }

    return { success: true, user };
  }
}