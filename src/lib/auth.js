import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminFound = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        const userFound = adminFound
          ? null
          : await prisma.user.findUnique({
              where: { email: credentials.email },
            });
        const serviceProviderFound =
          adminFound || userFound
            ? null
            : await prisma.serviceProvider.findUnique({
                where: { email: credentials.email },
              });
        const goodProviderFound =
          adminFound || userFound || serviceProviderFound
            ? null
            : await prisma.goodProvider.findUnique({
                where: { email: credentials.email },
              });

        const accountFound =
          adminFound ?? userFound ?? serviceProviderFound ?? goodProviderFound;

        if (!accountFound?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          accountFound.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: accountFound.id,
          email: accountFound.email,
          name: accountFound.name,
          role: accountFound.role ?? "USER",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "github" || !user.email) {
        return true;
      }

      const existingAdmin = await prisma.admin.findUnique({
        where: { email: user.email },
      });
      const existingUser = existingAdmin
        ? null
        : await prisma.user.findUnique({
            where: { email: user.email },
          });

      if (existingAdmin) {
        user.id = existingAdmin.id;
        user.role = existingAdmin.role;
        user.createdAt = existingAdmin.createdAt;
      } else if (!existingUser) {
        const createdUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            password: "",
          },
        });
        user.id = createdUser.id;
        user.role = createdUser.role;
        user.createdAt = createdUser.createdAt;
      } else {
        user.id = existingUser.id;
        user.role = existingUser.role;
        user.createdAt = existingUser.createdAt;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        createdAt: token.createdAt,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
