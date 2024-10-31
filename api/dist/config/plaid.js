"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const plaid_1 = require("plaid");
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
exports.client = new plaid_1.PlaidApi(configuration);
