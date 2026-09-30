// Simple auth credentials
const ADMIN_EMAIL = 'bahadirefesaricicek11@gmail.com';
const ADMIN_PASSWORD = 'adminpaneltestcode123';

export function validateCredentials(email: string, password: string): boolean {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  
  console.log('Email attempt:', trimmedEmail);
  console.log('Email expected:', ADMIN_EMAIL.toLowerCase());
  console.log('Password attempt length:', trimmedPassword.length);
  console.log('Password expected length:', ADMIN_PASSWORD.length);
  console.log('Match:', trimmedEmail === ADMIN_EMAIL.toLowerCase() && trimmedPassword === ADMIN_PASSWORD);
  
  return trimmedEmail === ADMIN_EMAIL.toLowerCase() && trimmedPassword === ADMIN_PASSWORD;
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
