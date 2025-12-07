import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
 
export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-foreground text-background hover:bg-foreground/90',
              card: 'bg-background border border-border',
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />

        {/* Forgot Password Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Forgot your password?{' '}
            <Link 
              href="/forgot-password" 
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              Reset it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}