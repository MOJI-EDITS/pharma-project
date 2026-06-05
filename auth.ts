import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import getClientPromise from './src/lib/mongodb-client'
import dbConnect from './src/lib/mongodb'
import { User } from './src/models/User'
import bcrypt from 'bcryptjs'

let adapter: any = undefined;
const uri = process.env.MONGODB_URI;
if (uri) {
  adapter = MongoDBAdapter(() => getClientPromise());
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
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

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
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