import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveAccounts = async (userId: string, accountsData: any[]) => {
  const savedAccounts = [];

  for (const accountData of accountsData) {
    const account = await prisma.account.upsert({
      where: {
        plaidAccountId: accountData.account_id,
      },
      update: {
        userId,
        plaidAccountId: accountData.account_id,
        mask: accountData.mask,
        name: accountData.name,
        officialName: accountData.official_name,
        subtype: accountData.subtype,
        type: accountData.type,
        balance: accountData.balance_id,
      },
      create: {
        userId,
        plaidAccountId: accountData.account_id,
        mask: accountData.mask,
        name: accountData.name,
        officialName: accountData.official_name,
        subtype: accountData.subtype,
        type: accountData.type,
        balance: accountData.balance_id,
      },
    });
    savedAccounts.push(account);
  }

  return savedAccounts;
};
