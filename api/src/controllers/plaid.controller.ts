import { Request, Response } from "express";
import { client } from "../config/plaid";
import { prisma } from "../config/prisma";
import { CountryCode, Products } from "plaid";

export async function createLinkToken(req: Request, res: Response) {
  try {
    const { email, name, auth0Id } = req.body;

    if (!email || !name || !auth0Id) {
      return res.status(400).json({
        error: "Missing required parameters: email, name, or auth0Id",
      });
    }

    // Find user first
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

export async function exchangePublicToken(req: Request, res: Response) {
  try {
    const { public_token, userId } = req.body;

    if (!public_token || !userId) {
      return res.status(400).json({
        error: "Missing required parameters: public_token or userId",
      });
    }

    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Exchange public token for access token
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = exchangeResponse.data.access_token;

    // Update user with new access token
    await prisma.user.update({
      where: { id: userId },
      data: { plaidAccessToken: accessToken },
    });

    // Fetch accounts associated with this access token
    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });

    // Create or update accounts
    const accountPromises = accountsResponse.data.accounts.map(
      async (account: any) => {
        return prisma.account.upsert({
          where: { plaidAccountId: account.account_id },
          create: {
            plaidAccountId: account.account_id,
            userId: userId,
            mask: account.mask ?? "",
            name: account.name,
            officialName: account.official_name,
            subtype: account.subtype,
            type: account.type,
            balance: account.balances.current ?? 0,
            currency: account.balances.iso_currency_code,
          },
          update: {
            mask: account.mask ?? "",
            name: account.name,
            officialName: account.official_name,
            subtype: account.subtype,
            type: account.type,
            balance: account.balances.current ?? 0,
            currency: account.balances.iso_currency_code,
          },
        });
      }
    );

    await Promise.all(accountPromises);

    // Get institution details
    const item = await client.itemGet({
      access_token: accessToken,
    });

    const institution = await client.institutionsGetById({
      institution_id: item.data.item.institution_id!,
      country_codes: [CountryCode.Us],
    });

    return res.json({
      success: true,
      institution: {
        name: institution.data.institution.name,
        id: item.data.item.institution_id,
      },
      accounts: accountsResponse.data.accounts.length,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res.status(500).json({
      error: "Failed to exchange public token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "userId is required",
      });
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};
