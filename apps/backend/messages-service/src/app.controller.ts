import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './message.schema';

@Controller()
export class AppController {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  // Obtener lista de chats
  @MessagePattern({ cmd: 'get_chats' })
  async getChats() {
    return this.chatModel.find().exec();
  }

  // Crear un mensaje nuevo (Simulado)
  @MessagePattern({ cmd: 'send_message' })
  async sendMessage(@Payload() data: { chatId: string, content: string }) {
    return this.chatModel.updateOne(
      { _id: data.chatId },
      { 
        $push: { messages: { sender: 'Me', content: data.content, timestamp: new Date() } }
      }
    );
  }
  
  // Inicializar datos dummy (para que no salga vacío al probar)
  @MessagePattern({ cmd: 'seed_chats' })
  async seed() {
    const exists = await this.chatModel.countDocuments();
    if (exists === 0) {
      await this.chatModel.create({
        participantName: "María González",
        project: "App Reciclaje",
        avatar: "MG",
        messages: [{ sender: 'Client', content: 'Hola, ¿cómo vas?', timestamp: new Date() }]
      });
    }
    return { status: 'ok' };
  }
}