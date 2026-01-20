'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { AuthLayout } from '@/components/layout';
import { Button, Input, Card, CardContent, Alert } from '@/components/ui';
import { School, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { validate, rules } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [mounted, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate form
    const validation = validate(
      { email, password },
      {
        email: [rules.required(), rules.email()],
        password: [rules.required(), rules.minLength(4, 'Password must be at least 4 characters')],
      }
    );

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    } else {
      router.push('/dashboard');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthLayout>
      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {/* Logo and Title */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <School className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">School Management System</h1>
            <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert type="error" className="mb-4 md:mb-6">
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={fieldErrors.email}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={fieldErrors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <div>
                  <span className="font-medium text-blue-600">Admin:</span>
                  <span className="text-gray-600 ml-2">admin@school.edu.bd</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@school.edu.bd');
                    setPassword('demo123');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Use
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                <div>
                  <span className="font-medium text-green-600">Teacher:</span>
                  <span className="text-gray-600 ml-2">rashida@school.edu.bd</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('rashida@school.edu.bd');
                    setPassword('demo123');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Use
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Password: any</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        © 2025 School Management System. All rights reserved.
      </p>
    </AuthLayout>
  );
}
