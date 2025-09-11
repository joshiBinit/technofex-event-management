export type loggedInUser = {
  username: string;
  password: string;
  role: 'user' | 'admin';
  returnUrl?: string;
};
