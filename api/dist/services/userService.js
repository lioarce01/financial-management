"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
                accounts: true,
                budgets: true,
                goals: true,
            },
        });
        return users;
    }
    catch (error) {
        console.error("Error fetching users,", error);
        throw error;
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                accounts: true,
                budgets: true,
                goals: true,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by id", error);
    }
};
exports.getUserById = getUserById;
const createUser = async ({ username, email, password }) => {
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
        },
    });
    return createdUser;
};
exports.createUser = createUser;
const deleteUser = async (id) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        await prisma.user.delete({ where: { id } });
    }
    catch (error) {
        console.error("Error deleting user", error);
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (id, { username, email, password }) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                passwordHash: password
                    ? bcrypt_1.default.hashSync(password, 10)
                    : user.passwordHash,
            },
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error updating user", error);
    }
};
exports.updateUser = updateUser;
