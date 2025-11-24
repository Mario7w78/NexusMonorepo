// apps/backend/users-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupabaseService } from './supabase.service';

@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) { }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: any) {
    console.log('📝 Create user request:', data);
    return await this.supabaseService.createUser(data);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAllUsers() {
    console.log('📋 Find all users request');
    return await this.supabaseService.findAllUsers();
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(@Payload() id: string) {
    console.log('🔍 Find user request:', id);
    return await this.supabaseService.findUserById(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(@Payload() data: { id: string; updates: any }) {
    console.log('✏️ Update user request:', data.id);
    return await this.supabaseService.updateUser(data.id, data.updates);
  }

  @MessagePattern({ cmd: 'get_user_stats' })
  async getUserStats(@Payload() id: string) {
    console.log('📊 Get user stats request:', id);
    const user = await this.supabaseService.findUserById(id);
    if (!user) return null;

    return {
      projectsCreated: user.projectsCreated || 0,
      projectsCollaborated: user.projectsCollaborated || 0,
      rating: user.rating || 0,
      totalEarnings: user.totalEarnings || 0
    };
  }

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() data: { fullName: string; email: string; password: string; specialty: string }) {
    console.log('📝 Register user request received:', { email: data.email, fullName: data.fullName });
    try {
      // Check if user exists
      console.log('🔍 Checking if user exists...');
      const { data: existing, error: checkError } = await this.supabaseService.getClient()
        .from('user')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking user:', checkError);
        return { success: false, message: `Database error: ${checkError.message}` };
      }

      if (existing) {
        console.log('⚠️ User already exists');
        return { success: false, message: 'Email already registered' };
      }

      // Create user
      console.log('✨ Creating new user...');
      const newUser = await this.supabaseService.createUser({
        fullName: data.fullName,
        email: data.email,
        specialty: data.specialty,
        passwordHash: data.password,
        avatar: data.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
        projectsCreated: 0,
        projectsCollaborated: 0,
        rating: 0,
        totalEarnings: 0
      });

      console.log('✅ User created successfully:', newUser.id);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Register error:', error);
      return { success: false, message: error.message };
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() data: { email: string; password: string }) {
    console.log('🔐 Login request received:', { email: data.email });
    try {
      const { data: user, error: loginError } = await this.supabaseService.getClient()
        .from('user')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();

      if (loginError) {
        console.error('❌ Error finding user:', loginError);
        return { success: false, message: `Database error: ${loginError.message}` };
      }

      if (!user) {
        console.log('⚠️ User not found');
        return { success: false, message: 'User not found' };
      }

      // Mock password check (NOT production ready)
      if (user.passwordHash !== data.password) {
        console.log('⚠️ Invalid password');
        return { success: false, message: 'Invalid password' };
      }

      console.log('✅ Login successful');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: error.message };
    }
  }
}