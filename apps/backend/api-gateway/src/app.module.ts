// apps/backend/api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 }, // Usuario -> Puerto 3001
      },
      {
        name: 'IDEAS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 }, // Ideas -> Puerto 3002
      },
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 }, // Mensajes -> Puerto 3003
      },
      {
        name: 'PAYMENTS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3004 }, // Pagos -> Puerto 3004
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }