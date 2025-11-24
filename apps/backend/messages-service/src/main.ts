import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // OJO: Usamos createMicroservice, NO create()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'messages_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  );
  await app.listen();
  console.log('Messages Service is running via RabbitMQ (messages_queue)');
}
bootstrap();