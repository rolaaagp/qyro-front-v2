export interface User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

export interface UserWithToken extends User {
  token: string;
}