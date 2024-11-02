import { client } from "../config/plaid";
import { prisma } from "../config/prisma";

export const fetchAndSaveTransactions = async (
  accessToken: string,
  userId: string
) => {
  const transactionsResponse = await client.transactionsSync({
    access_token: accessToken,
  });

  const accountRecords = await prisma.account.findMany({
    where: { userId },
  });

  const accountMap: { [key: string]: string } = {};
  accountRecords.forEach((account) => {
    accountMap[account.plaidAccountId] = account.id;
  });

  const transactionPromises = transactionsResponse.data.added.map(
    async (transaction: any) => {
      const accountId = accountMap[transaction.account_id];

      return prisma.transaction.upsert({
        where: { id: transaction.transaction_id },
        create: {
          id: transaction.transaction_id,
          accountId: accountId,
          userId: userId,
          transaction_id: transaction.transaction_id,
          amount: transaction.amount,
          iso_currency_code: transaction.iso_currency_code,
          date: new Date(transaction.date),
          name: transaction.name,
          merchant_name: transaction.merchant_name,
          pending: transaction.pending,
          payment_channel: transaction.payment_channel,
          transaction_type: transaction.transaction_type,
          logo_url: transaction.logo_url,
        },
        update: {
          amount: transaction.amount,
          iso_currency_code: transaction.iso_currency_code,
          date: new Date(transaction.date),
          name: transaction.name,
          merchant_name: transaction.merchant_name,
          pending: transaction.pending,
          payment_channel: transaction.payment_channel,
          transaction_type: transaction.transaction_type,
          logo_url: transaction.logo_url,
        },
      });
    }
  );

  await Promise.all(transactionPromises);

  return transactionsResponse.data.added;
};
