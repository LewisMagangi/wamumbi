import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  HeartIcon, 
  Users2Icon, 
  HomeIcon, 
  TrendingUpIcon,
  ArrowRight,
  DollarSignIcon,
  BookOpenIcon
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-900 to-rose-600 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || 'Friend'}!
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Thank you for being part of the Wamumbi family. Here&apos;s your impact overview.
              </p>
            </div>
            <div className="hidden md:block">
              <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white">
                <Link href="/donate">
                  Make a Donation <DollarSignIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Donations</p>
                <p className="text-2xl font-bold text-rose-600">$2,450</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-lg">
                <HeartIcon className="h-6 w-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Children Helped</p>
                <p className="text-2xl font-bold text-blue-600">127</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users2Icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+8</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Programs Supported</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Active programs</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Education Funds</p>
                <p className="text-2xl font-bold text-purple-600">$890</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Towards education</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-20 flex-col hover:bg-rose-50 hover:border-rose-200 transition-colors"
                >
                  <Link href="/donate">
                    <DollarSignIcon className="h-6 w-6 mb-2 text-rose-600" />
                    <span>Make a Donation</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-20 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <Link href="/profile">
                    <Users2Icon className="h-6 w-6 mb-2 text-blue-600" />
                    <span>View Profile</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-20 flex-col hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <Link href="/#impact">
                    <TrendingUpIcon className="h-6 w-6 mb-2 text-green-600" />
                    <span>View Impact</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-20 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  <Link href="/#testimonials">
                    <HeartIcon className="h-6 w-6 mb-2 text-purple-600" />
                    <span>Read Stories</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Recent Updates</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-rose-100 p-2 rounded-lg">
                  <HeartIcon className="h-4 w-4 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New donation received</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users2Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">5 children joined program</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <HomeIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Housing program update</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BookOpenIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Education milestone reached</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-4 justify-between">
              View all updates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to make an even bigger impact?
            </h2>
            <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
              Your contributions have already helped transform lives. Join us in reaching even more children 
              and families in need across our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/donate">
                  Donate Now <DollarSignIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-rose-600">
                <Link href="/#about">
                  Learn More <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}