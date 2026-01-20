'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { AuthLayout } from '@/components/layout';
import { Button, Input, Card, CardContent, Alert } from '@/components/ui';
import { School, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Users } from 'lucide-react';
import { validate, rules } from '@/lib/validation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [mounted, setMounted] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'admin' | 'teacher' | null>(null);

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

  const selectDemoAccount = (role: 'admin' | 'teacher') => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@school.edu.bd');
      setPassword('demo123');
    } else {
      setEmail('rashida@school.edu.bd');
      setPassword('demo123');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Mobile Logo - Only visible on mobile */}
        <div className="lg:hidden text-center mb-6">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <School className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ByteEdu</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <Card variant="elevated" className="overflow-hidden border-0 shadow-xl shadow-gray-200/50">
          <CardContent className="p-6 sm:p-8">
            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-black" />
                Welcome Back
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="text-gray-500 mt-2">Enter your credentials to access the dashboard</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Quick Login Cards */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => selectDemoAccount('admin')}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                    selectedRole === 'admin'
                      ? "border-black bg-gray-100"
                      : "border-gray-200 hover:border-black hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                    selectedRole === 'admin' ? "bg-black" : "bg-gray-200 group-hover:bg-gray-300"
                  )}>
                    <Shield className={cn("w-5 h-5", selectedRole === 'admin' ? "text-white" : "text-black")} />
                  </div>
                  <p className={cn("font-semibold text-sm", selectedRole === 'admin' ? "text-black" : "text-gray-900")}>
                    Administrator
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Full access</p>
                  {selectedRole === 'admin' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => selectDemoAccount('teacher')}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                    selectedRole === 'teacher'
                      ? "border-gray-600 bg-gray-100"
                      : "border-gray-200 hover:border-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                    selectedRole === 'teacher' ? "bg-gray-700" : "bg-gray-200 group-hover:bg-gray-300"
                  )}>
                    <Users className={cn("w-5 h-5", selectedRole === 'teacher' ? "text-white" : "text-gray-700")} />
                  </div>
                  <p className={cn("font-semibold text-sm", selectedRole === 'teacher' ? "text-gray-800" : "text-gray-900")}>
                    Teacher
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Limited access</p>
                  {selectedRole === 'teacher' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500">Or enter credentials</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedRole(null);
                }}
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
                    className="hover:text-gray-600 transition-colors"
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
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-black hover:text-gray-700 font-medium">
                  Forgot Password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white shadow-lg transition-all" 
                size="lg" 
                isLoading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">i</span>
                </span>
                Demo Credentials
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Admin</p>
                      <p className="text-[10px] text-gray-500">admin@school.edu.bd</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectDemoAccount('admin')}
                    className="px-3 py-1 text-xs font-medium text-black hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Use
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Teacher</p>
                      <p className="text-[10px] text-gray-500">rashida@school.edu.bd</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectDemoAccount('teacher')}
                    className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Use
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-3 text-center">Password: demo123 (or any)</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Footer */}
        <p className="lg:hidden text-center text-xs text-gray-400 mt-6">
          © 2026 ByteEdu
        </p>
      </div>
    </AuthLayout>
  );
}
