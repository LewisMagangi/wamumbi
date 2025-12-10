import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const campaignsRouter = router({
  getActive: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/active',
        tags: ['campaigns'],
        summary: 'Get active campaigns',
        description: 'Retrieves active campaigns with statistics'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number().describe('Campaign ID'),
      title: z.string().describe('Campaign title'),
      description: z.string().describe('Campaign description'),
      goal: z.number().describe('Target funding goal'),
      raised: z.number().describe('Current funding raised'),
      endDate: z.date().nullable().describe('Campaign end date'),
      startDate: z.date().describe('Campaign start date'),
      donationsCount: z.number().describe('Number of donations'),
      progressPercentage: z.number().describe('Completion percentage'),
      category: z.string().describe('Campaign category'),
      status: z.string().describe('Campaign status'),
      urgencyLevel: z.string().describe('Urgency level'),
      imageUrl: z.string().nullable().describe('Campaign image URL')
    })))
    .query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: {
            name: 'active'
          },
          end_date: {
            gte: new Date()
          }
        },
        include: {
          category: true,
          status: true,
          urgency_level: true,
          statistics: true,
          _count: {
            select: {
              donations: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 5
      });

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goal: Number(campaign.goal_amount),
        raised: Number(campaign.statistics?.current_amount || 0),
        endDate: campaign.end_date,
        startDate: campaign.start_date,
        donationsCount: campaign._count.donations,
        progressPercentage: Number(campaign.statistics?.completion_percentage || 0),
        category: campaign.category.name,
        status: campaign.status.name,
        urgencyLevel: campaign.urgency_level.name,
        imageUrl: campaign.image_url
      }));
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      return [];
    }
  }),

  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns',
        tags: ['campaigns'],
        summary: 'Get all campaigns',
        description: 'Retrieves all campaigns with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      goalAmount: z.number(),
      currentAmount: z.number(),
      imageUrl: z.string().nullable(),
      status: z.string(),
      statusId: z.number(),
      category: z.string(),
      categoryId: z.number(),
      urgencyLevel: z.string(),
      donationsCount: z.number(),
      progressPercentage: z.number(),
      startDate: z.date(),
      endDate: z.date().nullable(),
      createdAt: z.date()
    })))
    .query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        include: {
          category: true,
          status: true,
          urgency_level: true,
          statistics: true,
          _count: {
            select: {
              donations: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: Number(campaign.goal_amount),
        currentAmount: Number(campaign.statistics?.current_amount || 0),
        imageUrl: campaign.image_url,
        status: campaign.status.name,
        statusId: campaign.status_id,
        category: campaign.category.name,
        categoryId: campaign.category_id,
        urgencyLevel: campaign.urgency_level.name,
        donationsCount: campaign._count.donations,
        progressPercentage: Number(campaign.statistics?.completion_percentage || 0),
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        createdAt: campaign.created_at
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/{id}',
        tags: ['campaigns'],
        summary: 'Get campaign by ID',
        description: 'Retrieves a specific campaign by its ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      goalAmount: z.number(),
      currentAmount: z.number(),
      imageUrl: z.string().nullable(),
      status: z.string(),
      statusId: z.number(),
      category: z.string(),
      categoryId: z.number(),
      urgencyLevel: z.string(),
      urgencyLevelId: z.number(),
      currency: z.string(),
      currencyId: z.number(),
      targetBeneficiaries: z.number().nullable(),
      startDate: z.date(),
      endDate: z.date().nullable(),
      progressPercentage: z.number(),
      donationsCount: z.number(),
      uniqueDonorsCount: z.number(),
      averageDonation: z.number(),
      recentDonations: z.array(z.object({
        id: z.number(),
        amount: z.number(),
        donorName: z.string(),
        donationDate: z.date(),
        status: z.string()
      })),
      createdAt: z.date(),
      updatedAt: z.date()
    }))
    .query(async ({ input }) => {
    try {
      console.log('getById called with id:', input.id);
      const campaign = await prisma.campaign.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          status: true,
          urgency_level: true,
          currency: true,
          statistics: true,
          donations: {
            include: {
              donor: {
                select: {
                  first_name: true,
                  last_name: true,
                  is_anonymous: true
                }
              },
              status: true
            },
            orderBy: {
              donation_date: 'desc'
            },
            take: 10
          }
        }
      });

      console.log('Campaign found:', campaign ? 'yes' : 'no');

      if (!campaign) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Campaign with id ${input.id} not found`
        });
      }

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: Number(campaign.goal_amount),
        currentAmount: Number(campaign.statistics?.current_amount || 0),
        imageUrl: campaign.image_url,
        status: campaign.status.name,
        statusId: campaign.status_id,
        category: campaign.category.name,
        categoryId: campaign.category_id,
        urgencyLevel: campaign.urgency_level.name,
        urgencyLevelId: campaign.urgency_level_id,
        currency: campaign.currency.code,
        currencyId: campaign.currency_id,
        targetBeneficiaries: campaign.target_beneficiaries,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        progressPercentage: Number(campaign.statistics?.completion_percentage || 0),
        donationsCount: campaign.statistics?.donations_count || 0,
        uniqueDonorsCount: campaign.statistics?.unique_donors_count || 0,
        averageDonation: Number(campaign.statistics?.average_donation || 0),
        recentDonations: campaign.donations.map(d => ({
          id: d.id,
          amount: Number(d.amount),
          donorName: d.is_anonymous || d.donor.is_anonymous 
            ? 'Anonymous' 
            : `${d.donor.first_name || ''} ${d.donor.last_name || ''}`.trim(),
          donationDate: d.donation_date,
          status: d.status.name
        })),
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at
      };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw new Error('Failed to fetch campaign');
    }
  }),

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/campaigns',
        tags: ['campaigns'],
        summary: 'Create campaign',
        description: 'Creates a new campaign'
      }
    })
    .input(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    goalAmount: z.number().positive(),
    currencyId: z.number(),
    categoryId: z.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    imageUrl: z.string().optional(),
    urgencyLevelId: z.number(),
    targetBeneficiaries: z.number().optional(),
    createdBy: z.number().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      goalAmount: z.number(),
      currentAmount: z.number(),
      imageUrl: z.string().nullable(),
      status: z.string(),
      category: z.string(),
      urgencyLevel: z.string(),
      startDate: z.date(),
      endDate: z.date().nullable(),
      createdAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Get active status
      const activeStatus = await prisma.campaignStatus.findFirst({
        where: { name: 'active' }
      });

      const campaign = await prisma.campaign.create({
        data: {
          title: input.title,
          description: input.description,
          goal_amount: input.goalAmount,
          currency_id: input.currencyId,
          category_id: input.categoryId,
          status_id: activeStatus?.id || 1,
          start_date: input.startDate,
          end_date: input.endDate,
          image_url: input.imageUrl,
          urgency_level_id: input.urgencyLevelId,
          target_beneficiaries: input.targetBeneficiaries,
          created_by: input.createdBy
        },
        include: {
          category: true,
          status: true,
          urgency_level: true
        }
      });

      // Create initial statistics record
      await prisma.campaignStatistics.create({
        data: {
          campaign_id: campaign.id,
          current_amount: 0,
          donations_count: 0,
          unique_donors_count: 0,
          average_donation: 0,
          completion_percentage: 0
        }
      });

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: Number(campaign.goal_amount),
        currentAmount: 0,
        imageUrl: campaign.image_url,
        status: campaign.status.name,
        category: campaign.category.name,
        urgencyLevel: campaign.urgency_level.name,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        createdAt: campaign.created_at
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new Error('Failed to create campaign');
    }
  }),

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/campaigns/{id}',
        tags: ['campaigns'],
        summary: 'Update campaign',
        description: 'Updates an existing campaign'
      }
    })
    .input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    goalAmount: z.number().positive().optional(),
    categoryId: z.number().optional(),
    statusId: z.number().optional(),
    endDate: z.coerce.date().optional(),
    imageUrl: z.string().optional(),
    urgencyLevelId: z.number().optional(),
    targetBeneficiaries: z.number().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      goalAmount: z.number(),
      currentAmount: z.number(),
      imageUrl: z.string().nullable(),
      status: z.string(),
      category: z.string(),
      urgencyLevel: z.string(),
      startDate: z.date(),
      endDate: z.date().nullable(),
      updatedAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      const { id, goalAmount, categoryId, statusId, endDate, imageUrl, urgencyLevelId, targetBeneficiaries, ...rest } = input;
      
      const dataToUpdate: Record<string, unknown> = { ...rest };
      if (goalAmount !== undefined) dataToUpdate.goal_amount = goalAmount;
      if (categoryId !== undefined) dataToUpdate.category_id = categoryId;
      if (statusId !== undefined) dataToUpdate.status_id = statusId;
      if (endDate !== undefined) dataToUpdate.end_date = endDate;
      if (imageUrl !== undefined) dataToUpdate.image_url = imageUrl;
      if (urgencyLevelId !== undefined) dataToUpdate.urgency_level_id = urgencyLevelId;
      if (targetBeneficiaries !== undefined) dataToUpdate.target_beneficiaries = targetBeneficiaries;

      const campaign = await prisma.campaign.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: true,
          status: true,
          urgency_level: true,
          statistics: true
        }
      });

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: Number(campaign.goal_amount),
        currentAmount: Number(campaign.statistics?.current_amount || 0),
        imageUrl: campaign.image_url,
        status: campaign.status.name,
        category: campaign.category.name,
        urgencyLevel: campaign.urgency_level.name,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        updatedAt: campaign.updated_at
      };
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw new Error('Failed to update campaign');
    }
  }),

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/campaigns/{id}',
        tags: ['campaigns'],
        summary: 'Delete campaign',
        description: 'Deletes a campaign by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      await prisma.campaign.delete({
        where: { id: input.id }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw new Error('Failed to delete campaign');
    }
  }),

  getCategories: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/categories',
        tags: ['campaigns'],
        summary: 'Get campaign categories',
        description: 'Retrieves all active campaign categories'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      type: z.string(),
      is_active: z.boolean(),
      display_order: z.number()
    })))
    .query(async () => {
    try {
      const categories = await prisma.category.findMany({
        where: { 
          type: 'campaign',
          is_active: true 
        },
        orderBy: { display_order: 'asc' }
      });
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }),

  getStatuses: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/statuses',
        tags: ['campaigns'],
        summary: 'Get campaign statuses',
        description: 'Retrieves all active campaign statuses'
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
      const statuses = await prisma.campaignStatus.findMany({
        where: { is_active: true },
        orderBy: { display_order: 'asc' }
      });
      return statuses;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return [];
    }
  }),

  getUrgencyLevels: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/urgency-levels',
        tags: ['campaigns'],
        summary: 'Get urgency levels',
        description: 'Retrieves all active urgency levels'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      priority_score: z.number(),
      is_active: z.boolean()
    })))
    .query(async () => {
    try {
      const levels = await prisma.urgencyLevel.findMany({
        where: { is_active: true },
        orderBy: { priority_score: 'asc' }
      });
      return levels;
    } catch (error) {
      console.error('Error fetching urgency levels:', error);
      return [];
    }
  }),

  getCurrencies: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/campaigns/currencies',
        tags: ['campaigns'],
        summary: 'Get currencies',
        description: 'Retrieves all active currencies'
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
