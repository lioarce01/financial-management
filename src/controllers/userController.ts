import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from "../services/userService";

const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    if (!users) {
      res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user by id" });
  }
};

const createUserController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Please provide all required fields" });
  }
  try {
    const user = await createUser({ username, email, password });
    res.status(201).json({ mesage: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await deleteUser(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
};

const updateUserController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { username, email, password } = req.body;
  try {
    const user = await updateUser(id, { username, email, password });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  deleteUserController,
  updateUserController,
};
