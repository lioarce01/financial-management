import { Router } from "express";
import {
  createLinkToken,
  exchangePublicTokenController,
  getAccountsController,
} from "../controllers/plaid.controller";

const router = Router();

router.post("/link-token", createLinkToken);
router.post("/exchange-token", exchangePublicTokenController);
router.get("/accounts/:userId", getAccountsController);

export default router;
