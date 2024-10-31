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
exports.updateUserController = exports.deleteUserController = exports.createUserController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const userService_1 = require("../services/userService");
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getAllUsers)();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getAllUsersController = getAllUsersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.params;
        if (!auth0Id) {
            return res.status(400).json({ message: "auth0Id is required" });
        }
        const user = yield (0, userService_1.getUserById)(auth0Id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            return res.status(200).json(user);
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching user by id" });
    }
});
exports.getUserByIdController = getUserByIdController;
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, auth0Id } = req.body;
    if (!name || !email || !auth0Id) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }
    try {
        const user = yield (0, userService_1.createUser)({ name, email, auth0Id });
        return res.status(201).json(user);
    }
    catch (error) {
        const e = error;
        console.error("Error creating user", error);
        if (e.message === "User already exists") {
            return res.status(409).json({ message: "User already exists" });
        }
        return res.status(500).json({ message: "Error creating user" });
    }
});
exports.createUserController = createUserController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield (0, userService_1.deleteUser)(id);
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            return res.status(500).json({ message: "Error deleting user" });
        }
    }
});
exports.deleteUserController = deleteUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, email } = req.body;
    try {
        const user = yield (0, userService_1.updateUser)(id, { name, email });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateUserController = updateUserController;
