// apps/backend/users-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'arqnexsoft', // Tus credenciales del docker-compose
      password: 'arqnexsoft06',
      database: 'NexusUsersDB',
      entities: [User],
      synchronize: true, // Crea las tablas automáticamente
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
})
export class AppModule {}