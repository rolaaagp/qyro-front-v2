import { User } from './user.interface';

export interface IChat {
  id: number;
  user: User;
  title: string;
  created_at: string;
  updated_at: string;
  correlative: number;
}
