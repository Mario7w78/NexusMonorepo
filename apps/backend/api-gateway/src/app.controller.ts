// apps/backend/api-gateway/src/app.controller.ts
import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    @Inject('IDEAS_SERVICE') private ideasClient: ClientProxy,
    @Inject('MESSAGES_SERVICE') private messagesClient: ClientProxy,
  ) {}

  // --- USUARIOS ---
  @Post('users')
  createUser(@Body() data: any) {
    return this.usersClient.send({ cmd: 'create_user' }, data);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'find_user' }, id);
  }

  // --- IDEAS ---
  @Get('ideas')
  getIdeas() {
    return this.ideasClient.send({ cmd: 'get_ideas' }, {});
  }

  @Post('ideas')
  createIdea(@Body() data: any) {
    console.log('¡Llegó una nueva idea!', data); // <--- Agrega esto
    return this.ideasClient.send({ cmd: 'create_idea' }, data);

  }
  // --- MENSAJES ---
  @Get('messages/:userId')
  getChats(@Param('userId') userId: string) {
    return this.messagesClient.send({ cmd: 'get_chats' }, userId);
  }
}