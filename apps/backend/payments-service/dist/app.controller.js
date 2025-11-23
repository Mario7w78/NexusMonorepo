"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./payment.schema");
let AppController = class AppController {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async createTransaction(data) {
        const transaction = new this.transactionModel({
            ...data,
            status: 'completed',
            commission: data.amount * 0.05
        });
        return transaction.save();
    }
    async getUserTransactions(userId) {
        return this.transactionModel
            .find({
            $or: [{ fromUser: userId }, { toUser: userId }]
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getBalance(userId) {
        const transactions = await this.transactionModel.find({
            $or: [{ fromUser: userId }, { toUser: userId }],
            status: 'completed'
        }).exec();
        let balance = 0;
        transactions.forEach(tx => {
            if (tx.toUser === userId) {
                balance += tx.amount;
            }
            else if (tx.fromUser === userId) {
                balance -= (tx.amount + tx.commission);
            }
        });
        return { userId, balance };
    }
    async withdrawFunds(data) {
        const transaction = new this.transactionModel({
            type: 'withdrawal',
            amount: data.amount,
            fromUser: data.userId,
            status: 'completed',
            description: 'Withdrawal to bank account'
        });
        return transaction.save();
    }
    async seed() {
        const exists = await this.transactionModel.countDocuments();
        if (exists === 0) {
            await this.transactionModel.create([
                {
                    type: 'payment',
                    amount: 2500,
                    projectName: 'App Reciclaje',
                    fromUser: 'user456',
                    toUser: 'user123',
                    status: 'completed',
                    commission: 125,
                    description: 'Pago por desarrollo'
                },
                {
                    type: 'reward',
                    amount: 500,
                    projectName: 'Sistema Inventario',
                    fromUser: 'user789',
                    toUser: 'user123',
                    status: 'completed',
                    commission: 25,
                    description: 'Recompensa por prototipo'
                }
            ]);
        }
        return { status: 'ok' };
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'create_transaction' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTransaction", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_user_transactions' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserTransactions", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_balance' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBalance", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'withdraw_funds' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "withdrawFunds", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'seed_transactions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seed", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AppController);
//# sourceMappingURL=app.controller.js.map