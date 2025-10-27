import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get dashboard statistics
    const [userCount, monthlyDonationsSum, upcomingEvents, activeCampaigns] = await Promise.all([
      // Count total users as volunteers
      prisma.user.count(),
      
      // Get monthly donations sum
      prisma.donation.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),
      
      // Count upcoming events
      prisma.event.count({
        where: {
          startDate: {
            gte: new Date()
          }
        }
      }),
      
      // Count active campaigns as projects
      prisma.campaign.count({
        where: {
          active: true
        }
      })
    ]);

    // Get next event date
    const nextEvent = await prisma.event.findFirst({
      where: {
        startDate: {
          gte: new Date()
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      select: {
        startDate: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        activeVolunteers: userCount,
        monthlyDonations: monthlyDonationsSum._sum.amount || 0,
        upcomingEvents: upcomingEvents,
        activeProjects: activeCampaigns,
        nextEventDate: nextEvent?.startDate?.toISOString() || ''
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error',
        data: {
          activeVolunteers: 0,
          monthlyDonations: 0,
          upcomingEvents: 0,
          activeProjects: 0,
          nextEventDate: ''
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await request.json(); // Read the body but we don't use it
    
    // Currently, we don't need POST functionality for dashboard stats
    // as they are computed from other data
    return NextResponse.json({
      success: false,
      message: "POST method not supported for dashboard stats",
    }, { status: 405 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
