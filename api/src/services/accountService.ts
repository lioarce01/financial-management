import { client } from "../config/plaid";
import { prisma } from "../config/prisma";

export const getAccounts = async (userId: string) => {
  return await prisma.account.findMany({
    where: { userId },
  });
};

export const fetchAndSaveAccounts = async (
  accessToken: any,
  userId: string
) => {
  const accountsResponse = await client.accountsGet({
    access_token: accessToken,
  });

  const accountPromises = accountsResponse.data.accounts.map(
    async (account) => {
      return prisma.account.upsert({
        where: { plaidAccountId: account.account_id, userId },
        create: {
          plaidAccountId: account.account_id,
          userId: userId,
          mask: account.mask ?? "",
          name: account.name,
          officialName: account.official_name,
          subtype: account.subtype ?? "",
          type: account.type,
          balance: account.balances.current ?? 0,
          currency: account.balances.iso_currency_code,
        },
        update: {
          mask: account.mask ?? "",
          name: account.name,
          officialName: account.official_name,
          subtype: account.subtype ?? "",
          type: account.type,
          balance: account.balances.current ?? 0,
          currency: account.balances.iso_currency_code,
        },
      });
    }
  );

  await Promise.all(accountPromises);
  return accountsResponse.data.accounts;
};
