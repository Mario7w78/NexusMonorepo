// apps/backend/users-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Usa variables de entorno o valores por defecto (local)
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5435'),
      username: process.env.DB_USERNAME || 'arqnexsoft',
      password: process.env.DB_PASSWORD || 'arqnexsoft06',
      database: process.env.DB_NAME || 'NexusUsersDB',
      entities: [User],
      synchronize: true, // ⚠️ En producción, cambiar a false y usar migraciones
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
})
export class AppModule { }