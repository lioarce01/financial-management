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

      if (!accountId) {
        console.error(
          `Account ID not found for transaction: ${transaction.transaction_id}`
        );
        return null;
      }

      let categoryId = transaction.category_id;

      let existingCategory;

      if (
        categoryId &&
        typeof categoryId === "string" &&
        categoryId.length === 24
      ) {
        existingCategory = await prisma.category.findUnique({
          where: { id: categoryId },
        });
      }

      if (!existingCategory) {
        const categories = transaction.category || [];
        const categoryPromises = categories.map(async (category: any) => {
          return prisma.category.create({
            data: {
              primary: category,
            },
          });
        });

        const newCategories = await Promise.all(categoryPromises);
        categoryId = newCategories.length > 0 ? newCategories[0].id : null;
      }

      return prisma.transaction.upsert({
        where: { plaidTransactionId: transaction.transaction_id },
        create: {
          plaidTransactionId: transaction.transaction_id,
          accountId: accountId,
          userId: userId,
          amount: transaction.amount,
          iso_currency_code: transaction.iso_currency_code,
          date: new Date(transaction.date),
          name: transaction.name,
          merchant_name: transaction.merchant_name,
          pending: transaction.pending,
          payment_channel: transaction.payment_channel,
          transaction_type: transaction.transaction_type,
          logo_url: transaction.logo_url,
          categoryId: categoryId,
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
          categoryId: categoryId,
        },
      });
    }
  );

  await Promise.all(transactionPromises);

  return transactionsResponse.data.added;
};
