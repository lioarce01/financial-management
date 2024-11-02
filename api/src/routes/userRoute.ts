import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserController,
  createUserController,
  getTransactionsController,
  getAccountsController,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsersController);
router.get("/:auth0Id", getUserByIdController);
router.post("/register", createUserController);
router.delete("/:id", deleteUserController);
router.put("/:id", updateUserController);
router.get("/transactions/:userId", getTransactionsController);
router.get("/accounts/:userId", getAccountsController);

export default router;
