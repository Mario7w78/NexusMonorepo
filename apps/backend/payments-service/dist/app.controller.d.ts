import { Model } from 'mongoose';
import { Transaction } from './payment.schema';
export declare class AppController {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    createTransaction(data: any): Promise<import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserTransactions(userId: string): Promise<(import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getBalance(userId: string): Promise<{
        userId: string;
        balance: number;
    }>;
    withdrawFunds(data: {
        userId: string;
        amount: number;
    }): Promise<import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    seed(): Promise<{
        status: string;
    }>;
}
