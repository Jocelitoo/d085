"use server";

import { GET } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";

export const getSession = async () => {
  return await getServerSession(GET);
};

export const getCurrentUser = async () => {
  try {
    const session = (await getSession()) as Session;

    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!currentUser) return null;

    return {
      ...currentUser,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
