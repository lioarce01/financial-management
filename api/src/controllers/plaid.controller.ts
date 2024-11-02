import { Request, Response } from "express";
import { client } from "../config/plaid";
import { prisma } from "../config/prisma";
import { CountryCode, Products } from "plaid";
import {
  exchangePublicToken,
  updateUserAccessToken,
} from "../services/plaidService";
import { fetchAndSaveAccounts } from "../services/accountService";
import { getInstitutionDetails } from "../services/institutionService";
import { fetchAndSaveTransactions } from "../services/transactionService";

export async function createLinkToken(req: Request, res: Response) {
  try {
    const { email, name, auth0Id } = req.body;

    if (!email || !name || !auth0Id) {
      return res.status(400).json({
        error: "Missing required parameters: email, name, or auth0Id",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found. Please ensure user is registered first.",
      });
    }

    const configs = {
      user: {
        client_user_id: user.id,
      },
      client_name: "Your App Name",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const createTokenResponse = await client.linkTokenCreate(configs);

    return res.json({
      linkToken: createTokenResponse.data.link_token,
      userId: user.id,
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

    const accounts = await fetchAndSaveAccounts(accessToken, userId);

    await fetchAndSaveTransactions(accessToken, userId);

    const institution = await getInstitutionDetails(accessToken);

    return res.json({
      success: true,
      institution,
      accountsCount: accounts.length,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res
      .status(500)
      .json({ message: "Failed to exchange public token." });
  }
};
