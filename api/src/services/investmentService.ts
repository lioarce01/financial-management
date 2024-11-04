import { client } from "../config/plaid";
import { prisma } from "../config/prisma";

export const fetchAndSaveHoldings = async (
  accessToken: string,
  userId: string
) => {
  const holdingsResponse = await client.investmentsHoldingsGet({
    access_token: accessToken,
  });

  const accountRecords = await prisma.account.findMany({
    where: { userId },
  });

  const accountMap: { [key: string]: string } = {};

  accountRecords.forEach((account) => {
    accountMap[account.plaidAccountId] = account.id;
  });

  const holdingPromises = holdingsResponse.data.holdings.map(
    async (holdings: any) => {
      const accountId = accountMap[holdings.account_id];
      console.log("Account ID:", accountId);

      if (!accountId) {
        console.error(
          `Account ID not found for holdings: ${holdings.account_id}`
        );
        return;
      }

      return prisma.holdings.upsert({
        where: {
          accountId_security_id: {
            accountId: accountId,
            security_id: holdings.security_id,
          },
        },
        create: {
          accountId: accountId,
          security_id: holdings.security_id,
          cost_basis: holdings.cost_basis,
          institution_price: holdings.institution_price,
          institution_price_as_of: holdings.institution_price_as_of,
          institution_value: holdings.institution_value,
          quantity: holdings.quantity,
          iso_currency_code: holdings.iso_currency_code,
        },
        update: {
          cost_basis: holdings.cost_basis,
          institution_price: holdings.institution_price,
          institution_price_as_of: holdings.institution_price_as_of,
          institution_value: holdings.institution_value,
          quantity: holdings.quantity,
          iso_currency_code: holdings.iso_currency_code,
        },
      });
    }
  );

  await Promise.all(holdingPromises);

  return holdingsResponse.data.holdings;
};
