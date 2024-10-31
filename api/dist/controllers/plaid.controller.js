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
exports.getAccounts = exports.exchangePublicToken = exports.createLinkToken = void 0;
const plaid_1 = require("../config/plaid");
const prisma_1 = require("../config/prisma");
const plaid_2 = require("plaid");
const createLinkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({
                error: "Missing required fields",
                details: "Email and name are required",
            });
        }
        // Create or update user
        const user = yield prisma_1.prisma.user.upsert({
            where: {
                email: email,
            },
            update: {
                name: name,
            },
            create: {
                email: email,
                name: name,
                auth0Id: email,
            },
        });
        const request = {
            user: { client_user_id: user.id },
            client_name: process.env.PLAID_CLIENT_NAME || "Your App Name",
            products: [plaid_2.Products.Auth],
            country_codes: [plaid_2.CountryCode.Us],
            language: "en",
        };
        const createTokenResponse = yield plaid_1.client.linkTokenCreate(request);
        res.json({
            linkToken: createTokenResponse.data.link_token,
            userId: user.id,
        });
    }
    catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({ error: "Failed to create link token" });
    }
});
exports.createLinkToken = createLinkToken;
const exchangePublicToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { public_token, userId } = req.body;
        if (!public_token || !userId) {
            return res.status(400).json({
                error: "Missing required fields",
                details: "Public token and userId are required",
            });
        }
        const exchangeResponse = yield plaid_1.client.itemPublicTokenExchange({
            public_token: public_token,
        });
        const accessToken = exchangeResponse.data.access_token;
        // Update user with access token
        yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: { plaidAccessToken: accessToken },
        });
        // Fetch accounts
        const accountsResponse = yield plaid_1.client.accountsGet({
            access_token: accessToken,
        });
        // Save accounts to database
        const accounts = accountsResponse.data.accounts;
        const accountPromises = accounts.map((account) => {
            return prisma_1.prisma.account.upsert({
                where: { plaidAccountId: account.account_id },
                update: {
                    name: account.name,
                    mask: account.mask || "",
                    officialName: account.official_name,
                    type: account.type,
                    subtype: account.subtype || "unknown",
                    balance: account.balances.current || 0,
                    currency: account.balances.iso_currency_code || "USD",
                },
                create: {
                    userId,
                    plaidAccountId: account.account_id,
                    name: account.name,
                    mask: account.mask || "",
                    officialName: account.official_name,
                    type: account.type,
                    subtype: account.subtype || "unknown",
                    balance: account.balances.current || 0,
                    currency: account.balances.iso_currency_code || "USD",
                },
            });
        });
        yield Promise.all(accountPromises);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error exchanging token:", error);
        res.status(500).json({ error: "Failed to exchange token" });
    }
});
exports.exchangePublicToken = exchangePublicToken;
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                error: "Missing required field",
                details: "userId is required",
            });
        }
        const accounts = yield prisma_1.prisma.account.findMany({
            where: { userId },
        });
        res.json(accounts);
    }
    catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
});
exports.getAccounts = getAccounts;
