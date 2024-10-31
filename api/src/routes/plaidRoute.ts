import { Router } from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getAccounts,
} from "../controllers/plaid.controller";

const router = Router();

router.post("/link-token", createLinkToken);
router.post("/exchange-token", exchangePublicToken);
router.get("/accounts/:userId", getAccounts);

export default router;
