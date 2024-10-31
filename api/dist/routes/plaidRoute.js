"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plaid_controller_1 = require("../controllers/plaid.controller");
const router = (0, express_1.Router)();
router.post("/link-token", plaid_controller_1.createLinkToken);
router.post("/exchange-token", plaid_controller_1.exchangePublicToken);
router.get("/accounts/:userId", plaid_controller_1.getAccounts);
exports.default = router;
