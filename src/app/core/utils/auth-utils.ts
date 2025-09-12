import { User } from '../../shared/model/user.model';
import { generateToken } from './token.utils';
import { buildAuthData, saveAuthData } from './local-storage-utils';

export function authenticate(
  users: User[],
  credentials: { username: string; password: string; role: string }
) {
  const existingUser = users.find(
    (u: User) =>
      (u.username === credentials.username ||
        u.email === credentials.username) &&
      u.password === credentials.password &&
      u.role === credentials.role
  );

  if (!existingUser) {
    return null;
  }

  const token = generateToken();
  const authData = buildAuthData(existingUser, token);
  saveAuthData(authData);

  return authData;
}

export function signupUser(newUser: User) {
  const token = generateToken();
  const authData = buildAuthData(newUser, token);
  saveAuthData(authData);

  return authData;
}
