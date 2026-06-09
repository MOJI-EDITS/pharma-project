import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { inMemoryStore } from './src/lib/in-memory-store'
import bcrypt from 'bcryptjs'

// Determine the base URL dynamically
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // For local development
  return 'http://localhost:3000';
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await inMemoryStore.findUserByEmail(email);

        if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Check if user exists
          let existingUser = await inMemoryStore.findUserByEmail(profile.email);
          
          if (!existingUser) {
            // Create new user from Google profile
            existingUser = await inMemoryStore.createUser({
              email: profile.email,
              name: profile.name || '',
              emailVerified: true, // Google emails are pre-verified
              role: 'user',
              accountStatus: 'active',
            });
          }
          
          // Attach user ID to the user object for session
          (user as any).id = existingUser.id;
          (user as any).role = existingUser.role;
          
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allow callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow same origin URLs
      else if (new URL(url).origin === baseUrl) return url;
      
      // Default redirect to complete-profile for OAuth users
      return `${baseUrl}/auth/complete-profile`;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
});