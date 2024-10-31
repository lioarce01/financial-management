"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAccounts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saveAccounts = (userId, accountsData) => __awaiter(void 0, void 0, void 0, function* () {
    const savedAccounts = [];
    for (const accountData of accountsData) {
        const account = yield prisma.account.upsert({
            where: {
                plaidAccountId: accountData.account_id,
            },
            update: {
                userId,
                plaidAccountId: accountData.account_id,
                mask: accountData.mask,
                name: accountData.name,
                officialName: accountData.official_name,
                subtype: accountData.subtype,
                type: accountData.type,
                balance: accountData.balance_id,
            },
            create: {
                userId,
                plaidAccountId: accountData.account_id,
                mask: accountData.mask,
                name: accountData.name,
                officialName: accountData.official_name,
                subtype: accountData.subtype,
                type: accountData.type,
                balance: accountData.balance_id,
            },
        });
        savedAccounts.push(account);
    }
    return savedAccounts;
});
exports.saveAccounts = saveAccounts;
