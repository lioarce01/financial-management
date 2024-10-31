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
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: {
                accounts: true,
            },
        });
        return users;
    }
    catch (error) {
        console.error("Error fetching users,", error);
        throw error;
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!auth0Id) {
        throw new Error("auth0Id must be provided");
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                auth0Id: auth0Id,
            },
            include: {
                accounts: true,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by id", error);
    }
});
exports.getUserById = getUserById;
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, auth0Id }) {
    const existingUser = yield prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    try {
        const user = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                auth0Id: auth0Id,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error creating user", error);
        throw error;
    }
});
exports.createUser = createUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        yield prisma.user.delete({ where: { id } });
    }
    catch (error) {
        console.error("Error deleting user", error);
    }
});
exports.deleteUser = deleteUser;
const updateUser = (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { name, email }) {
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: {
                name,
                email,
            },
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error updating user", error);
    }
});
exports.updateUser = updateUser;
