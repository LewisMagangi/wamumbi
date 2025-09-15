import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const dashboardRouter = router({
  getStats: procedure.query(async () => {
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
            status: 'completed'
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

      return {
        activeVolunteers: userCount,
        monthlyDonations: monthlyDonationsSum._sum.amount || 0,
        upcomingEvents: upcomingEvents,
        activeProjects: activeCampaigns,
        nextEventDate: nextEvent?.startDate?.toISOString() || ''
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values in case of error
      return {
        activeVolunteers: 0,
        monthlyDonations: 0,
        upcomingEvents: 0,
        activeProjects: 0,
        nextEventDate: ''
      };
    }
  }),
});