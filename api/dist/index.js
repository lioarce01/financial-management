"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use((0, cors_1.default)(corsOptions));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
exports.default = app;
