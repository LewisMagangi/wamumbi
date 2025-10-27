import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const donationsRouter = router({
  getRecent: procedure.query(async () => {
    try {
      const donations = await prisma.donation.findMany({
        where: {
          status: 'COMPLETED'
        },
        include: {
          donor: {
            select: {
              firstName: true,
              lastName: true,
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
        },
        take: 10 // Default limit
      });

      return donations.map(donation => ({
        id: donation.id,
        amount: donation.amount,
        donationDate: donation.createdAt,
        donorName: `${donation.donor.firstName} ${donation.donor.lastName}`,
        campaignTitle: donation.campaign?.title || 'General Donation',
        paymentMethod: 'Card', // Default since not in schema
        status: donation.status,
        currency: donation.currency
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
          donor: {
            select: {
              firstName: true,
              lastName: true,
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
        donorName: `${donation.donor.firstName} ${donation.donor.lastName}`,
        donorEmail: donation.donor.email,
        campaignTitle: donation.campaign?.title || 'General Donation',
        paymentMethod: 'Card', // Default since not in schema
        status: donation.status,
        currency: donation.currency,
        isAnonymous: false
      }));
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  }),
});