import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import type { User } from "@/types/db";
import type { RowDataPacket } from "mysql2";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const [rows] = await db.query(
          "SELECT id, email, password_hash FROM users WHERE email = ?",
          [credentials.email]
        ) as [RowDataPacket[], unknown];

        const users = rows as User[];
        if (users.length === 0) {
          return null;
        }

        const user = users[0];
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (passwordsMatch) {
          return { id: user.id.toString(), email: user.email };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/",
  },
});
