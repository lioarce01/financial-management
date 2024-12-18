import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getTransactions,
  getAccounts,
  getTransactionCountByCategory,
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
    const newUser = await createUser({ auth0Id, name, email });

    if (newUser) {
      res.status(201).json(newUser);
    } else {
      console.error("Failed to create user");
      res.status(400).json({ message: "Failed to create user" });
    }
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

export const getAccountsController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  try {
    const { results, count } = await getAccounts(userId, offset, limit);

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "No accounts found for user",
        results: [],
        count: 0,
      });
    }

    return res.status(200).json({ results, count });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error:" });
  }
};

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  try {
    const { results, count } = await getTransactions(userId, offset, limit);

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "No transactions found for user",
        results: [],
        count,
      });
    }

    return res.status(200).json({ results, count });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Internal server error  " });
  }
};

export const getTransactionCategoryCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const categoryCounts = await getTransactionCountByCategory(userId);

    res.status(200).json(categoryCounts);
  } catch (error) {
    console.error("Error in getTransactionCategoryCounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
