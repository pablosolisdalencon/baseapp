import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  tokens?: number; // Field for storing the number of available tokens
}

export const defaultUserTokens = 10; // Default tokens for a new user
