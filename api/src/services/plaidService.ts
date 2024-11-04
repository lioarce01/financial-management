import { prisma } from "../config/prisma";
import { client } from "../config/plaid";
import { Products, CountryCode } from "plaid";

export const createLinkTokenService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found. Please ensure user is registered first.");
  }

  const configs = {
    user: {
      client_user_id: user.id,
    },

    client_name: "Your App Name",
    products: [Products.Auth, Products.Transactions, Products.Investments],
    country_codes: [CountryCode.Us],
    language: "en",
  };

  const createTokenResponse = await client.linkTokenCreate(configs);

  return {
    linkToken: createTokenResponse.data.link_token,
    userId: user.id,
  };
};

export const exchangePublicToken = async (publicToken: any) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: publicToken,
  });
  return exchangeResponse.data.access_token;
};

export const updateUserAccessToken = async (
  userId: string,
  accessToken: any
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { plaidAccessToken: accessToken },
  });
};

export const getInvestmentHoldings = async (accessToken: string) => {
  const holdingResponse = await client.investmentsHoldingsGet({
    access_token: accessToken,
  });
  return holdingResponse.data.holdings;
};

export const getInvestmentTransactions = async (
  accessToken: string,
  startDate: string,
  endDate: string
) => {
  const transactionsResponse = await client.investmentsTransactionsGet({
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
  });
  return transactionsResponse.data;
};
