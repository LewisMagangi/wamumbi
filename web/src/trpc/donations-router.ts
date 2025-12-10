import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const donationsRouter = router({
  getRecent: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/recent',
        tags: ['donations'],
        summary: 'Get recent donations',
        description: 'Retrieves the most recent donations'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      amount: z.number(),
      donationDate: z.date(),
      donorName: z.string(),
      campaignTitle: z.string(),
      paymentMethod: z.string(),
      status: z.string(),
      currency: z.string()
    })))
    .query(async () => {
    try {
      const donations = await prisma.donation.findMany({
        include: {
          donor: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              is_anonymous: true
            }
          },
          campaign: {
            select: {
              title: true
            }
          },
          currency: true,
          payment_method: true,
          status: true
        },
        orderBy: {
          donation_date: 'desc'
        },
        take: 10
      });

      return donations.map(donation => ({
        id: donation.id,
        amount: Number(donation.amount),
        donationDate: donation.donation_date,
        donorName: donation.is_anonymous || donation.donor.is_anonymous
          ? 'Anonymous'
          : `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim() || 'Anonymous',
        campaignTitle: donation.campaign?.title || 'General Donation',
        paymentMethod: donation.payment_method.name,
        status: donation.status.name,
        currency: donation.currency.code
      }));
    } catch (error) {
      console.error('Error fetching recent donations:', error);
      return [];
    }
  }),

  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations',
        tags: ['donations'],
        summary: 'Get all donations',
        description: 'Retrieves all donations with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      amount: z.number(),
      donationDate: z.date(),
      donorName: z.string(),
      donorEmail: z.string().nullable(),
      campaignId: z.number(),
      campaignTitle: z.string(),
      paymentMethod: z.string(),
      status: z.string(),
      statusId: z.number(),
      currency: z.string(),
      currencyId: z.number(),
      isAnonymous: z.boolean(),
      isRecurring: z.boolean(),
      notes: z.string().nullable(),
      createdAt: z.date()
    })))
    .query(async () => {
    try {
      const donations = await prisma.donation.findMany({
        include: {
          donor: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              is_anonymous: true
            }
          },
          campaign: {
            select: {
              id: true,
              title: true
            }
          },
          currency: true,
          payment_method: true,
          status: true
        },
        orderBy: {
          donation_date: 'desc'
        }
      });

      return donations.map(donation => ({
        id: donation.id,
        amount: Number(donation.amount),
        donationDate: donation.donation_date,
        donorName: donation.is_anonymous || donation.donor.is_anonymous
          ? 'Anonymous'
          : `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim() || 'Anonymous',
        donorEmail: donation.donor.email,
        campaignId: donation.campaign?.id,
        campaignTitle: donation.campaign?.title || 'General Donation',
        paymentMethod: donation.payment_method.name,
        status: donation.status.name,
        statusId: donation.status_id,
        currency: donation.currency.code,
        currencyId: donation.currency_id,
        isAnonymous: donation.is_anonymous,
        isRecurring: donation.is_recurring,
        notes: donation.notes,
        createdAt: donation.created_at
      }));
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/{id}',
        tags: ['donations'],
        summary: 'Get donation by ID',
        description: 'Retrieves a specific donation by its ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      amount: z.number(),
      netAmount: z.number().nullable(),
      processingFee: z.number().nullable(),
      donationDate: z.date(),
      processedAt: z.date().nullable(),
      donor: z.object({
        id: z.number(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        email: z.string().nullable(),
        phone: z.string().nullable(),
        isAnonymous: z.boolean()
      }),
      campaign: z.object({
        id: z.number(),
        title: z.string()
      }).nullable(),
      paymentMethod: z.string(),
      paymentMethodId: z.number(),
      paymentReference: z.string().nullable(),
      status: z.string(),
      statusId: z.number(),
      currency: z.string(),
      currencyId: z.number(),
      isAnonymous: z.boolean(),
      isRecurring: z.boolean(),
      recurringFrequency: z.string().nullable().optional(),
      notes: z.string().nullable(),
      createdAt: z.date()
    }))
    .query(async ({ input }) => {
    try {
      const donation = await prisma.donation.findUnique({
        where: { id: input.id },
        include: {
          donor: true,
          campaign: true,
          currency: true,
          payment_method: true,
          status: true,
          recurring_frequency: true
        }
      });

      if (!donation) {
        throw new Error('Donation not found');
      }

      return {
        id: donation.id,
        amount: Number(donation.amount),
        netAmount: donation.net_amount ? Number(donation.net_amount) : null,
        processingFee: donation.processing_fee ? Number(donation.processing_fee) : null,
        donationDate: donation.donation_date,
        processedAt: donation.processed_at,
        donor: {
          id: donation.donor.id,
          firstName: donation.donor.first_name,
          lastName: donation.donor.last_name,
          email: donation.donor.email,
          phone: donation.donor.phone,
          isAnonymous: donation.donor.is_anonymous
        },
        campaign: donation.campaign ? {
          id: donation.campaign.id,
          title: donation.campaign.title
        } : null,
        paymentMethod: donation.payment_method.name,
        paymentMethodId: donation.payment_method_id,
        paymentReference: donation.payment_reference,
        status: donation.status.name,
        statusId: donation.status_id,
        currency: donation.currency.code,
        currencyId: donation.currency_id,
        isAnonymous: donation.is_anonymous,
        isRecurring: donation.is_recurring,
        recurringFrequency: donation.recurring_frequency?.name,
        notes: donation.notes,
        createdAt: donation.created_at
      };
    } catch (error) {
      console.error('Error fetching donation:', error);
      throw new Error('Failed to fetch donation');
    }
  }),

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/donations',
        tags: ['donations'],
        summary: 'Create donation',
        description: 'Creates a new donation'
      }
    })
    .input(z.object({
    amount: z.number().positive(),
    currencyId: z.number(),
    donorId: z.number(),
    campaignId: z.number(),
    paymentMethodId: z.number(),
    paymentReference: z.string().optional(),
    notes: z.string().optional(),
    isAnonymous: z.boolean().default(false),
    isRecurring: z.boolean().default(false),
    recurringFrequencyId: z.number().optional()
  }))
    .output(z.object({
      id: z.number(),
      amount: z.number(),
      donorName: z.string(),
      campaignTitle: z.string().nullable(),
      status: z.string(),
      currency: z.string(),
      createdAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Get completed status
      const completedStatus = await prisma.donationStatus.findFirst({
        where: { name: 'completed' }
      });

      // Get payment method for fee calculation
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: input.paymentMethodId }
      });

      // Calculate processing fee
      const processingFeePercentage = Number(paymentMethod?.processing_fee_percentage || 0);
      const fixedFee = Number(paymentMethod?.fixed_fee_amount || 0);
      const processingFee = (input.amount * processingFeePercentage) + fixedFee;
      const netAmount = input.amount - processingFee;

      const donation = await prisma.donation.create({
        data: {
          amount: input.amount,
          currency_id: input.currencyId,
          donor_id: input.donorId,
          campaign_id: input.campaignId,
          payment_method_id: input.paymentMethodId,
          payment_reference: input.paymentReference,
          status_id: completedStatus?.id || 1,
          is_anonymous: input.isAnonymous,
          is_recurring: input.isRecurring,
          recurring_frequency_id: input.recurringFrequencyId,
          processing_fee: processingFee,
          net_amount: netAmount,
          notes: input.notes,
          donation_date: new Date(),
          processed_at: new Date()
        },
        include: {
          donor: true,
          campaign: true,
          currency: true,
          payment_method: true,
          status: true
        }
      });

      // Update campaign statistics
      await prisma.campaignStatistics.upsert({
        where: { campaign_id: input.campaignId },
        create: {
          campaign_id: input.campaignId,
          current_amount: input.amount,
          donations_count: 1,
          unique_donors_count: 1,
          average_donation: input.amount,
          completion_percentage: 0,
          last_donation_date: new Date()
        },
        update: {
          current_amount: { increment: input.amount },
          donations_count: { increment: 1 },
          last_donation_date: new Date()
        }
      });

      return {
        id: donation.id,
        amount: Number(donation.amount),
        donorName: donation.is_anonymous
          ? 'Anonymous'
          : `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim(),
        campaignTitle: donation.campaign?.title,
        status: donation.status.name,
        currency: donation.currency.code,
        createdAt: donation.created_at
      };
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error('Failed to create donation');
    }
  }),

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/donations/{id}',
        tags: ['donations'],
        summary: 'Update donation',
        description: 'Updates an existing donation'
      }
    })
    .input(z.object({
    id: z.number(),
    statusId: z.number().optional(),
    notes: z.string().optional()
  }))
    .output(z.object({
      id: z.number(),
      amount: z.number(),
      status: z.string(),
      notes: z.string().nullable()
    }))
    .mutation(async ({ input }) => {
    try {
      const { id, statusId, notes } = input;
      
      const dataToUpdate: Record<string, unknown> = {};
      if (statusId !== undefined) dataToUpdate.status_id = statusId;
      if (notes !== undefined) dataToUpdate.notes = notes;

      const donation = await prisma.donation.update({
        where: { id },
        data: dataToUpdate,
        include: {
          donor: true,
          campaign: true,
          status: true,
          currency: true
        }
      });

      return {
        id: donation.id,
        amount: Number(donation.amount),
        status: donation.status.name,
        notes: donation.notes
      };
    } catch (error) {
      console.error('Error updating donation:', error);
      throw new Error('Failed to update donation');
    }
  }),

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/donations/{id}',
        tags: ['donations'],
        summary: 'Delete donation',
        description: 'Deletes a donation by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      // Get the donation first to update campaign stats
      const donation = await prisma.donation.findUnique({
        where: { id: input.id }
      });

      if (donation) {
        // Update campaign statistics (decrement)
        await prisma.campaignStatistics.update({
          where: { campaign_id: donation.campaign_id },
          data: {
            current_amount: { decrement: Number(donation.amount) },
            donations_count: { decrement: 1 }
          }
        });
      }

      await prisma.donation.delete({
        where: { id: input.id }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw new Error('Failed to delete donation');
    }
  }),

  // Create or find donor
  createDonor: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/donations/donors',
        tags: ['donations'],
        summary: 'Create donor',
        description: 'Creates a new donor or returns existing one'
      }
    })
    .input(z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    isAnonymous: z.boolean().default(true)
  }))
    .output(z.object({
      id: z.number(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
      is_anonymous: z.boolean()
    }))
    .mutation(async ({ input }) => {
    try {
      // Check if donor with email already exists
      if (input.email) {
        const existingDonor = await prisma.donor.findFirst({
          where: { email: input.email }
        });
        if (existingDonor) {
          return existingDonor;
        }
      }

      const donor = await prisma.donor.create({
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          phone: input.phone,
          is_anonymous: input.isAnonymous
        }
      });

      return donor;
    } catch (error) {
      console.error('Error creating donor:', error);
      throw new Error('Failed to create donor');
    }
  }),

  getPaymentMethods: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/payment-methods',
        tags: ['donations'],
        summary: 'Get payment methods',
        description: 'Retrieves all active payment methods'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      is_active: z.boolean(),
      processing_fee_percentage: z.any(),
      fixed_fee_amount: z.any()
    })))
    .query(async () => {
    try {
      const methods = await prisma.paymentMethod.findMany({
        where: { is_active: true }
      });
      return methods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }),

  getStatuses: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/statuses',
        tags: ['donations'],
        summary: 'Get donation statuses',
        description: 'Retrieves all active donation statuses'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      is_active: z.boolean(),
      display_order: z.number()
    })))
    .query(async () => {
    try {
      const statuses = await prisma.donationStatus.findMany({
        where: { is_active: true },
        orderBy: { display_order: 'asc' }
      });
      return statuses;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return [];
    }
  }),

  getRecurringFrequencies: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/recurring-frequencies',
        tags: ['donations'],
        summary: 'Get recurring frequencies',
        description: 'Retrieves all active recurring donation frequencies'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      is_active: z.boolean(),
      display_order: z.number()
    })))
    .query(async () => {
    try {
      const frequencies = await prisma.recurringFrequency.findMany({
        where: { is_active: true },
        orderBy: { display_order: 'asc' }
      });
      return frequencies;
    } catch (error) {
      console.error('Error fetching recurring frequencies:', error);
      return [];
    }
  }),

  getCurrencies: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/donations/currencies',
        tags: ['donations'],
        summary: 'Get currencies',
        description: 'Retrieves all available currencies for donations'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      code: z.string(),
      name: z.string(),
      symbol: z.string(),
      is_active: z.boolean()
    })))
    .query(async () => {
    try {
      const currencies = await prisma.currency.findMany({
        where: { is_active: true },
        orderBy: { code: 'asc' }
      });
      return currencies;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return [];
    }
  })
});
