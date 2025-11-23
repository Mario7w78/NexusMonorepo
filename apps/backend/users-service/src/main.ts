// apps/backend/users-service/src/main.ts
import 'dotenv/config'; // Cargar variables de entorno
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port: 3001 }, // Importante: 3001
    },
  );
  await app.listen();
  console.log('Users Service is running on port 3001');
  console.log(`Connected to database: ${process.env.DB_HOST || 'localhost'}`);
}
bootstrap();