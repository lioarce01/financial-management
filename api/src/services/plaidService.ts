import { prisma } from "../config/prisma";
import { client } from "../config/plaid";

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
