'use server'

import connectDB from "@/database";
import User from "@/models/userModel";
import { getSessionUser } from "@/utils/getSessionUser";

export async function getUser() {
  await connectDB();

  const session = await getSessionUser();

  if (!session?.user) {
    return null
  }

  const dbUser = await User.findById(session?.userId).lean();

  return JSON.parse(JSON.stringify(dbUser));
}