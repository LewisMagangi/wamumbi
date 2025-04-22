import { SignUp } from '@clerk/nextjs';
 
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to get started with Wamumbi
          </p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-foreground text-background hover:bg-foreground/90',
              card: 'bg-background border border-border',
            },
          }}
        />
      </div>
    </div>
  );
}