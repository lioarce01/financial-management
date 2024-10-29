"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.createUserController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const userService_1 = require("../services/userService");
const getAllUsersController = async (req, res) => {
    try {
        const users = await (0, userService_1.getAllUsers)();
        if (!users) {
            res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
exports.getAllUsersController = getAllUsersController;
const getUserByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await (0, userService_1.getUserById)(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user by id" });
    }
};
exports.getUserByIdController = getUserByIdController;
const createUserController = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        const user = await (0, userService_1.createUser)({ username, email, password });
        res.status(201).json({ mesage: "User created successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};
exports.createUserController = createUserController;
const deleteUserController = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: "Please provide user id" });
    }
    try {
        await (0, userService_1.deleteUser)(id);
        res.status(204).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};
exports.deleteUserController = deleteUserController;
