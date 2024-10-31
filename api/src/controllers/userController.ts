import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from "../services/userService";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.params;

    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id is required" });
    }

    const user = await getUserById(auth0Id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user by id" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, auth0Id } = req.body;

  if (!name || !email || !auth0Id) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const user = await createUser({ name, email, auth0Id });
    return res.status(201).json(user);
  } catch (error) {
    const e = error as Error;
    console.error("Error creating user", error);

    if (e.message === "User already exists") {
      return res.status(409).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Error creating user" });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await deleteUser(id as string);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(500).json({ message: "Error deleting user" });
    }
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email } = req.body;
  try {
    const user = await updateUser(id, { name, email });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error updating user" });
  }
};
