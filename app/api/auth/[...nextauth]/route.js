const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

import bcrypt from 'bcryptjs'
import NextAuth from "next-auth"; 
import GitHubProvider from "next-auth/providers/github";
 import GoogleProvider from "next-auth/providers/google";
  import CredentialsProvider from "next-auth/providers/credentials";

async function verifyUser(email, password) {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, role: true, password: true }
    });

    if (!user) return null;

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return null;
  }
}

   

 export const authOptions ={
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return await verifyUser(credentials.email, credentials.password);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
       
        if (!existingUser) {
         
          await prisma.user.create({
            data: {
              name: user.name || "Unnamed",
              email: user.email,
              role: "USER",
              password:'1245'
            },
          });
         
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Fetch user from DB to get role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        token.id = dbUser?.id;
        token.role = dbUser?.role || "USER";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler=NextAuth(authOptions)
export { handler as GET, handler as POST, }; 