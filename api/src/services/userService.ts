import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateUserInput {
  name: string;
  email: string;
  auth0Id: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
}

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        transactions: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users,", error);
    throw error;
  }
};

const getUserById = async (auth0Id: string): Promise<User | null> => {
  if (!auth0Id) {
    throw new Error("auth0Id must be provided");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
      include: { accounts: true, transactions: true },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by auth0Id:", error);
    throw error;
  }
};

const createUser = async ({ auth0Id, name, email }: CreateUserInput) => {
  try {
    const existingUser = await getUserById(auth0Id);

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }
    const newUser = await prisma.user.create({
      data: { auth0Id, name, email },
    });
    console.log("User created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const deleteUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting user", error);
  }
};

const updateUser = async (id: string, { name, email }: UpdateUserInput) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
  }
};

const getTransactions = async (
  offset: number,
  limit: number,
  userId: string
) => {
  if (!userId || typeof userId !== "string" || userId.length !== 24) {
    throw new Error("Invalid userId");
  }

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      include: {
        category: true,
      },
    }),
    prisma.transaction.count({
      where: { userId },
    }),
  ]);

  return { results: transactions, count: totalCount };
};

const getAccounts = async (offset: number, limit: number, userId: string) => {
  if (!userId || typeof userId !== "string" || userId.length !== 24) {
    throw new Error("Invalid userId");
  }

  const [accounts, totalCount] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
      skip: offset,
      take: limit,
    }),
    prisma.account.count({
      where: { userId },
    }),
  ]);
  return { results: accounts, count: totalCount };
};

export {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getTransactions,
  getAccounts,
};
