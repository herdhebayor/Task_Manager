import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";

// NextAuth App Router handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

