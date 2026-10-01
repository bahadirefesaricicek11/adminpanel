'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Supabase for tracking
    this.logErrorToSupabase(error, errorInfo);

    // Also log to browser console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private logErrorToSupabase = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('error_logs').insert([
        {
          error_id: this.state.errorId,
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack,
          user_id: user?.id || null,
          user_email: user?.email || null,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : null,
        },
      ]);
    } catch (logError) {
      console.error('Failed to log error to Supabase:', logError);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-red-200">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-slate-600 text-center text-sm mb-4">
              Admin panelinde beklenmeyen bir sorun yaşandı. Lütfen sayfayı yenileyin veya destek ekibiyle iletişime geçin.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 max-h-32 overflow-y-auto">
              <p className="text-xs font-mono text-red-700">
                <strong>Hata ID:</strong> {this.state.errorId}
              </p>
              {this.state.error && (
                <>
                  <p className="text-xs font-mono text-red-700 mt-2">
                    <strong>Mesaj:</strong> {this.state.error.message}
                  </p>
                  <p className="text-xs font-mono text-red-600 mt-1 whitespace-pre-wrap break-words">
                    {this.state.error.stack?.substring(0, 200)}...
                  </p>
                </>
              )}
            </div>

            {/* Error ID for Support */}
            <p className="text-xs text-slate-500 text-center mb-6">
              Destek için bu hata ID'sini bizimle paylaşın: <br />
              <code className="bg-slate-100 px-2 py-1 rounded mt-1 block font-bold">
                {this.state.errorId}
              </code>
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white gap-2"
              >
                <RotateCcw size={18} />
                Tekrar Deneyin
              </Button>
              <Button
                onClick={() => (window.location.href = '/admin/dashboard')}
                variant="outline"
                className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Button>
            </div>

            {/* Development Info */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 p-3 bg-yellow-50 rounded border border-yellow-200">
                <summary className="cursor-pointer text-sm font-semibold text-yellow-900">
                  Geliştirici: Hata Detayları
                </summary>
                <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto max-h-40 text-yellow-900">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
