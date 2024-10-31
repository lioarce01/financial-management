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
exports.saveAccountsController = void 0;
const accountService_1 = require("../services/accountService");
const saveAccountsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, accounts } = req.body;
    if (!userId || !accounts || !Array.isArray(accounts)) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }
    try {
        const savedAccounts = yield (0, accountService_1.saveAccounts)(userId, accounts);
        return res.status(201).json(savedAccounts);
    }
    catch (error) {
        console.error("Error saving accounts:", error);
        return res.status(500).json({ message: "Error saving accounts" });
    }
});
exports.saveAccountsController = saveAccountsController;
