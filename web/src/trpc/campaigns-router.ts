import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const campaignsRouter = router({
  getActive: procedure.query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          active: true,
          endDate: {
            gte: new Date() // Only active and not yet ended
          }
        },
        include: {
          _count: {
            select: {
              donations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5 // Limit for dashboard overview
      });

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        goal: Number(campaign.target),
        raised: Number(campaign.raised),
        endDate: campaign.endDate,
        startDate: campaign.startDate,
        donationsCount: campaign._count.donations,
        progressPercentage: campaign.target > 0 
          ? Math.round((Number(campaign.raised) / Number(campaign.target)) * 100)
          : 0
      }));
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      return [];
    }
  }),

  getAll: procedure.query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          active: true
        },
        include: {
          _count: {
            select: {
              donations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: campaign.target,
        currentAmount: campaign.raised,
        imageUrl: campaign.imageUrl,
        active: campaign.active,
        donationsCount: campaign._count.donations,
        progressPercentage: campaign.target > 0 
          ? Math.round((Number(campaign.raised) / Number(campaign.target)) * 100)
          : 0,
        createdAt: campaign.createdAt
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }),

  getById: procedure.query(async () => {
    try {
      const campaign = await prisma.campaign.findFirst({
        include: {
          donations: {
            where: {
              status: 'COMPLETED'
            },
            include: {
              donor: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return {
        ...campaign,
        goalAmount: campaign.target,
        currentAmount: campaign.raised,
        progressPercentage: campaign.target > 0 
          ? Math.round((Number(campaign.raised) / Number(campaign.target)) * 100)
          : 0,
        recentDonations: campaign.donations.map(d => ({
          amount: d.amount,
          donorName: `${d.donor.firstName} ${d.donor.lastName}`,
          createdAt: d.createdAt
        }))
      };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw new Error('Failed to fetch campaign');
    }
  }),
});