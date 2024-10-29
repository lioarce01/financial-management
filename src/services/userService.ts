import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        budgets: true,
        goals: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users,", error);
    throw error;
  }
};

const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        accounts: true,
        budgets: true,
        goals: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by id", error);
  }
};

const createUser = async ({ username, email, password }: CreateUserInput) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  return createdUser;
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

const updateUser = async (
  id: string,
  { username, email, password }: CreateUserInput
) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        passwordHash: password
          ? bcrypt.hashSync(password, 10)
          : user.passwordHash,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
  }
};

export { getAllUsers, getUserById, createUser, deleteUser, updateUser };
