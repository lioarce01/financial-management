"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const dotenv = __importStar(require("dotenv"));
const plaid_1 = require("plaid");
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: ["*"],
};
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
const client = new plaid_1.PlaidApi(configuration);
app.post("/create_link_token", async (req, res) => {
    try {
        const response = await client.linkTokenCreate({
            user: {
                client_user_id: "user-id",
            },
            client_name: "Tu Nombre de Aplicación",
            products: [plaid_1.Products.Transactions],
            country_codes: [plaid_1.CountryCode.Us],
            language: "es",
        });
        res.json({ link_token: response.data.link_token });
    }
    catch (error) {
        console.error("Error creando link token:", error);
        res.status(500).json({ error: "Error creating link token" });
    }
});
app.post("/exchange_public_token", async (req, res) => {
    const { public_token } = req.body;
    const response = await client.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;
    res.json({ access_token });
});
app.use((0, cors_1.default)(corsOptions));
app.use("/", routes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
exports.default = app;
