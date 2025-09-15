import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const donationsRouter = router({
  getRecent: procedure.query(async () => {
    try {
      const donations = await prisma.donation.findMany({
        where: {
          status: 'completed'
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          campaign: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10 // Default limit
      });

        return donations.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          donationDate: donation.createdAt,
          donorName: donation.user.name || 'Anonymous',
          campaignTitle: donation.campaign?.title || 'General Donation',
          paymentMethod: 'Card', // Default since not in schema
          status: donation.status
        }));
      } catch (error) {
        console.error('Error fetching recent donations:', error);
        return [];
      }
    }),

  getAll: procedure.query(async () => {
    try {
      const donations = await prisma.donation.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          campaign: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return donations.map(donation => ({
        id: donation.id,
        amount: donation.amount,
        donationDate: donation.createdAt,
        donorName: donation.user.name || 'Anonymous',
        donorEmail: donation.user.email,
        campaignTitle: donation.campaign?.title || 'General Donation',
        paymentMethod: 'Card', // Default since not in schema
        status: donation.status,
        isAnonymous: !donation.user.name
      }));
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  }),
});