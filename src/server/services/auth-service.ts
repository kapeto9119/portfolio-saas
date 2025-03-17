import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'

import { prisma } from '@/server/models/prisma'

// Make sure prisma is initialized before creating the adapter
const adapter = PrismaAdapter(prisma)

// Declare module augmentation for session user
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authConfig: NextAuthOptions = {
  adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
    verifyRequest: '/verify-request',
    newUser: '/dashboard',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string, 
          user.password as string
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string || "",
          email: token.email as string || "",
          image: token.picture as string || null,
        };
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUser = token.email 
        ? await prisma.user.findFirst({
            where: {
              email: token.email as string,
            },
          })
        : null;

      if (!dbUser) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}

// Export auth helper functions
const { auth, signIn, signOut } = NextAuth(authConfig);
export { auth, signIn, signOut }; 