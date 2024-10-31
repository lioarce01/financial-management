import express from "express";
import userRoute from "./userRoute";
import plaidRoute from "./plaidRoute";

const router = express.Router();

router.use("/users", userRoute);
router.use("/plaid", plaidRoute);

export default router;
