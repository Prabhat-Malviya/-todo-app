<<<<<<< HEAD
import NextAuth, { type SessionStrategy, type DefaultSession, type JWT, type User } from "next-auth";
=======
import NextAuth, { type SessionStrategy, type DefaultSession } from "next-auth";
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
<<<<<<< HEAD
      role: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    role?: string;
  }
}

interface Token extends JWT {
  id?: string;
  role?: string;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
=======
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

<<<<<<< HEAD
        return { id: user.id, email: user.email, name: user.name, role: user.role || "user" };
=======
        return { id: user.id, email: user.email, name: user.name };
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
      },
    }),
  ],
  callbacks: {
<<<<<<< HEAD
    async jwt({ token, user }: { token: Token; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: Token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
=======
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

<<<<<<< HEAD
export { handler as GET, handler as POST };
=======
export { handler as GET, handler as POST };
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
