"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: 'localhost',
            port: 3004,
        },
    });
    await app.listen();
    console.log('Payments Service is listening on port 3004');
}
bootstrap();
//# sourceMappingURL=main.js.map