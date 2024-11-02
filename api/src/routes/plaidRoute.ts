import { Router } from "express";
import {
  createLinkToken,
  exchangePublicTokenController,
} from "../controllers/plaid.controller";

const router = Router();

router.post("/link-token", createLinkToken);
router.post("/exchange-token", exchangePublicTokenController);

export default router;
