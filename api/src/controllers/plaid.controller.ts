import { Request, Response } from "express";
import { client } from "../config/plaid";
import { prisma } from "../config/prisma";
import { CountryCode, Products } from "plaid";

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Email and name are required",
      });
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
      },
      create: {
        email: email,
        name: name,
        auth0Id: email,
      },
    });

    const request = {
      user: { client_user_id: user.id },
      client_name: process.env.PLAID_CLIENT_NAME || "Your App Name",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const createTokenResponse = await client.linkTokenCreate(request);
    res.json({
      linkToken: createTokenResponse.data.link_token,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error creating link token:", error);
    res.status(500).json({ error: "Failed to create link token" });
  }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
  try {
    const { public_token, userId } = req.body;

    if (!public_token || !userId) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Public token and userId are required",
      });
    }

    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = exchangeResponse.data.access_token;

    // Update user with access token
    await prisma.user.update({
      where: { id: userId },
      data: { plaidAccessToken: accessToken },
    });

    // Fetch accounts
    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });

    // Save accounts to database
    const accounts = accountsResponse.data.accounts;
    const accountPromises = accounts.map((account: any) => {
      return prisma.account.upsert({
        where: { plaidAccountId: account.account_id },
        update: {
          name: account.name,
          mask: account.mask || "",
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype || "unknown",
          balance: account.balances.current || 0,
          currency: account.balances.iso_currency_code || "USD",
        },
        create: {
          userId,
          plaidAccountId: account.account_id,
          name: account.name,
          mask: account.mask || "",
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype || "unknown",
          balance: account.balances.current || 0,
          currency: account.balances.iso_currency_code || "USD",
        },
      });
    });

    await Promise.all(accountPromises);

    res.json({ success: true });
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};

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
