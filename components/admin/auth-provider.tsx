'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    const isAuthPage = pathname === '/admin/login';
    
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
      // If on login page and authenticated, redirect to dashboard
      if (isAuthPage) {
        router.push('/admin');
      }
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
      // If not authenticated and trying to access admin pages, redirect to login
      if (pathname.startsWith('/admin') && !isAuthPage) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
