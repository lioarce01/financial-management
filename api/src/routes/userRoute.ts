import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  deleteUserController,
  updateUserController,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.post("/", createUserController);

router.delete("/:id", deleteUserController);

router.put("/:id", updateUserController);

export default router;
