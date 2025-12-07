'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSignIn } from '@clerk/nextjs';

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Use Clerk's create method to initiate password reset
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setStatus({
        type: 'success',
        message: 'Password reset email sent! Please check your inbox and follow the instructions.',
      });
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setStatus({
        type: 'error',
        message: error.errors?.[0]?.message || 'Failed to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <div>
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="/sign-in">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status Messages */}
            {status.type && (
              <Alert variant={status.type === 'success' ? 'default' : 'destructive'}>
                {status.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isLoading || !isLoaded}
            >
              {isLoading ? 'Sending...' : 'Send reset email'}
            </Button>
          </form>

          {/* Alternative Options */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/sign-in" className="font-medium text-rose-600 hover:text-rose-500">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-medium text-rose-600 hover:text-rose-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you don&apos;t receive an email within a few minutes, please check your spam folder or verify that you entered the correct email address.
          </p>
        </div>
      </div>
    </div>
  );
}
