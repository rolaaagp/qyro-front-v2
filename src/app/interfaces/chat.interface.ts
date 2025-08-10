import { User } from './user.interface';

export interface IChat {
  id: number;
  user: User;
  title: string;
  created_at: string;
  updated_at: string;
  correlative: number;
}

export interface IMessages {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
  updated_at: string;
  chat?: IChat;
}
