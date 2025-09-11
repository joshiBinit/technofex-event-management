export function buildAuthData(user: any, token: string) {
  return { ...user, token };
}

export function saveAuthData(authData: any): void {
  localStorage.setItem('authData', JSON.stringify(authData));
}

export function getAuthData(): any | null {
  const data = localStorage.getItem('authData');
  return data ? JSON.parse(data) : null;
}

export function clearAuthData(): void {
  localStorage.removeItem('authData');
}
