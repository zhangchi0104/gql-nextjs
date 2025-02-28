import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { SignJWT } from "jose";

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
export async function hashAndSaltPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
export async function issueJwt(token: JWT) {
  const newToken = await new SignJWT({ username: token.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(token.exp || "1h")
    .setIssuer(process.env.AUTH_ISSUER!)
    .setAudience(process.env.AUTH_AUDIENCE!)
    .sign(new TextEncoder().encode(process.env.AUTH_JWT_SECRET!));
  return newToken;
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        if (!username || !password) {
          throw new Error("Missing username or password");
        }
        const dummyPasswordHash = await hashAndSaltPassword(
          process.env.AUTH_DUMMY_PASSWORD!,
        );
        console.log(password as string, dummyPasswordHash);
        const result = await bcrypt.compare(
          password as string,
          dummyPasswordHash,
        );

        if (username === process.env.AUTH_DUMMY_USERNAME && result) {
          return { id: "1", name: "Test User" };
        }
        throw new Error("Invalid username or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.accessToken = await issueJwt(token);
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      console.log("session", session);
      return session;
    },
  },
});
