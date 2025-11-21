import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { Chat, ChatSchema } from './message.schema';

@Module({
  imports: [
    // Conexión a la misma DB de Mongo pero quizás diferente colección o DB lógica
    MongooseModule.forRoot('mongodb://localhost:27017/nexus_messages'),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [AppController],
})
export class AppModule {}