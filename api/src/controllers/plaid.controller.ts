import { Request, Response } from "express";
import {
  createLinkTokenService,
  exchangePublicToken,
  updateUserAccessToken,
} from "../services/plaidService";
import { fetchAndSaveAccounts } from "../services/accountService";
import { getInstitutionDetails } from "../services/institutionService";
import { fetchAndSaveTransactions } from "../services/transactionService";
import { fetchAndSaveHoldings } from "../services/investmentService";

export async function createLinkToken(req: Request, res: Response) {
  try {
    const { email, name, auth0Id } = req.body;

    if (!email || !name || !auth0Id) {
      return res.status(400).json({
        message: "Missing required parameters: email, name, or auth0Id",
      });
    }

    const { linkToken, userId } = await createLinkTokenService(email);

    return res.json({
      linkToken,
      userId,
    });
  } catch (error) {
    console.error("Error creating link token:", error);
    return res.status(500).json({
      error: "Failed to create link token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export const exchangePublicTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const { public_token, userId } = req.body;

    if (!public_token || !userId) {
      return res.status(400).json({
        message: "Missing required parameters: public_token or userId",
      });
    }

    const accessToken = await exchangePublicToken(public_token);
    await updateUserAccessToken(userId, accessToken);

    const [accounts, transactions, institution, holdings] = await Promise.all([
      fetchAndSaveAccounts(accessToken, userId),
      fetchAndSaveTransactions(accessToken, userId),
      getInstitutionDetails(accessToken),
      fetchAndSaveHoldings(accessToken, userId),
    ]);

    return res.json({
      success: true,
      institution,
      holdings,
      accountsCount: accounts.length,
      transactionsCount: transactions.length,
      holdingsCount: holdings.length,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res
      .status(500)
      .json({ message: "Failed to exchange public token." });
  }
};
