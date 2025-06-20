import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectToDatabase } from '@/utils/mongodb'; // Utility to connect to MongoDB
import { defaultUserTokens } from '@/models/User'; // Default tokens for new users

// Type assertion for environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Google OAuth environment variables are not set');
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(
    (async () => {
      const { client } = await connectToDatabase();
      return client;
    })() // IIFE to pass the promise correctly
  ),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: 'database', // Using database strategy for sessions
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID and tokens to the session object
      if (session.user) {
        (session.user as any).id = user.id; // user.id is available from the adapter
        (session.user as any).tokens = (user as any).tokens; // Add tokens from the user object in DB
      }
      return session;
    },
  },
  events: {
    async createUser(message) {
      // Initialize tokens for new users
      // The user object in `message.user` is the newly created user from the database
      const { client, db } = await connectToDatabase();
      const usersCollection = db.collection('users');

      await usersCollection.updateOne(
        { _id: message.user.id as any }, // Ensure correct type for _id
        { $set: { tokens: defaultUserTokens } }
      );
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };