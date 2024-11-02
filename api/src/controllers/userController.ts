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

export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { auth0Id } = req.params;

  try {
    const user = await getUserById(auth0Id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user by id" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { auth0Id, name, email } = req.body;

  try {
    const existingUser = await getUserById(auth0Id);

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = await createUser({ auth0Id, name, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
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
