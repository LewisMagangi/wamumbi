import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Since we're using Clerk for authentication, we'll redirect to their sign-in page
  // You can customize this as needed
  redirect('/sign-in');
  
  // This code won't execute due to the redirect, but it's needed for TypeScript to recognize
  // this as a valid component
  return null;
}