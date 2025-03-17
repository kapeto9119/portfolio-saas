import { authConfig } from "@/server/services/auth-service";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST }; 