'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateCredentials, setAuthToken, generateToken } from '@/lib/auth';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Log what we're sending
      console.log('Login attempt:');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      
      // Validate credentials
      if (validateCredentials(email, password)) {
        // Set auth token
        const token = generateToken();
        setAuthToken(token);
        
        console.log('Login successful!');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/admin');
        }, 100);
      } else {
        console.log('Credentials do not match');
        setError('Invalid email or password. Please check your credentials carefully.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">PaintCo Admin</h1>
            <p className="text-slate-600 mt-2">Management Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-slate-600 mb-2 font-semibold">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded">
              <p><span className="font-semibold">Email:</span> bahadirefesaricicek11@gmail.com</p>
              <p><span className="font-semibold">Password:</span> adminpaneltestcode123</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
