// Simple auth credentials
const ADMIN_EMAIL = 'bahadirefesaricicek11@gmail.com';
const ADMIN_PASSWORD = 'adminpaneltestcode123';

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Generate a simple token
export function generateToken(): string {
  return 'admin_' + Math.random().toString(36).substr(2, 9);
}
