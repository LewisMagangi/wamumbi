import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal dashboard</p>
      </div>
      
      <div className="bg-background/50 border border-border rounded-lg p-6">
        <p className="text-lg">
          Welcome to your Wamumbi dashboard! This is a protected page that only authenticated users can access.
        </p>
      </div>
    </div>
  );
}