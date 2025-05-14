export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
}
