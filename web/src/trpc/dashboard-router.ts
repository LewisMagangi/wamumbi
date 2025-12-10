import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const dashboardRouter = router({
  getStats: procedure.query(async () => {
    try {
      const [
        totalDonations,
        totalCampaigns,
        totalVolunteers,
        totalEvents,
        totalProjects,
        activeCampaigns,
        recentDonations,
        upcomingEvents
      ] = await Promise.all([
        prisma.donation.aggregate({
          _sum: {
            amount: true
          }
        }),
        prisma.campaign.count(),
        prisma.volunteer.count(),
        prisma.event.count(),
        prisma.project.count(),
        prisma.campaign.count({
          where: {
            status: {
              name: 'active'
            }
          }
        }),
        prisma.donation.count({
          where: {
            created_at: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        }),
        prisma.event.count({
          where: {
            event_date: {
              gte: new Date()
            }
          }
        })
      ]);

      return {
        totalDonations: Number(totalDonations._sum.amount || 0),
        totalCampaigns,
        activeCampaigns,
        totalVolunteers,
        totalEvents,
        upcomingEvents,
        totalProjects,
        recentDonationsCount: recentDonations
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalDonations: 0,
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalVolunteers: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        totalProjects: 0,
        recentDonationsCount: 0
      };
    }
  }),

  getRecentDonations: procedure.query(async () => {
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
        currency: donation.currency.code,
        currencySymbol: donation.currency.symbol,
        donorName: donation.donor && !donation.donor.is_anonymous
          ? `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim() || 'Anonymous'
          : 'Anonymous',
        campaignId: donation.campaign?.id,
        campaignTitle: donation.campaign?.title || 'General Fund',
        status: donation.status.name,
        donationDate: donation.donation_date,
        isAnonymous: donation.is_anonymous
      }));
    } catch (error) {
      console.error('Error fetching recent donations:', error);
      return [];
    }
  }),

  getUpcomingEvents: procedure.query(async () => {
    try {
      const events = await prisma.event.findMany({
        where: {
          event_date: {
            gte: new Date()
          }
        },
        include: {
          category: true,
          status: true,
          _count: {
            select: {
              registrations: true
            }
          }
        },
        orderBy: {
          event_date: 'asc'
        },
        take: 5
      });

      return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        capacity: event.capacity,
        registrationsCount: event._count.registrations,
        availableSpots: event.capacity - event._count.registrations,
        imageUrl: event.image_url,
        status: event.status.name,
        category: event.category.name
      }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }),

  getActiveCampaigns: procedure.query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: {
            name: 'active'
          }
        },
        include: {
          category: true,
          status: true,
          currency: true,
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
        goalAmount: Number(campaign.goal_amount),
        currentAmount: campaign.statistics ? Number(campaign.statistics.current_amount) : 0,
        currency: campaign.currency.code,
        currencySymbol: campaign.currency.symbol,
        progress: campaign.statistics 
          ? Math.round((Number(campaign.statistics.current_amount) / Number(campaign.goal_amount)) * 100)
          : 0,
        donationsCount: campaign._count.donations,
        status: campaign.status.name,
        category: campaign.category.name,
        imageUrl: campaign.image_url,
        startDate: campaign.start_date,
        endDate: campaign.end_date
      }));
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      return [];
    }
  }),

  getActiveProjects: procedure.query(async () => {
    try {
      const projects = await prisma.project.findMany({
        where: {
          status: {
            name: 'active'
          }
        },
        include: {
          status: true,
          team: {
            select: {
              id: true,
              name: true
            }
          },
          creator: {
            select: {
              first_name: true,
              last_name: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 5
      });

      return projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status.name,
        teamName: project.team?.name || null,
        creator: project.creator 
          ? `${project.creator.first_name || ''} ${project.creator.last_name || ''}`.trim()
          : null,
        startDate: project.start_date,
        endDate: project.end_date
      }));
    } catch (error) {
      console.error('Error fetching active projects:', error);
      return [];
    }
  }),

  getRecentBlogPosts: procedure.query(async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          status: {
            name: 'published'
          }
        },
        include: {
          author: {
            select: {
              first_name: true,
              last_name: true,
              profile_image: true
            }
          },
          category: true
        },
        orderBy: {
          published_at: 'desc'
        },
        take: 5
      });

      return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        featuredImage: post.featured_image,
        author: post.author ? {
          name: `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim(),
          imageUrl: post.author.profile_image
        } : null,
        category: post.category.name,
        publishedAt: post.published_at
      }));
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
      return [];
    }
  }),

  getNotifications: procedure.query(async () => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          is_read: false
        },
        include: {
          notification_type: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 10
      });

      return notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.notification_type.name,
        isRead: notification.is_read,
        createdAt: notification.created_at
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }),

  getMonthlyDonationTrend: procedure.query(async () => {
    try {
      // Get donations for the last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const donations = await prisma.donation.findMany({
        where: {
          donation_date: {
            gte: twelveMonthsAgo
          }
        },
        select: {
          amount: true,
          donation_date: true
        }
      });

      // Group by month
      const monthlyData: Record<string, number> = {};
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = 0;
        months.push({
          key,
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
      }

      donations.forEach(donation => {
        const date = new Date(donation.donation_date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key] !== undefined) {
          monthlyData[key] += Number(donation.amount);
        }
      });

      return months.map(month => ({
        month: month.label,
        amount: monthlyData[month.key]
      }));
    } catch (error) {
      console.error('Error fetching donation trend:', error);
      return [];
    }
  }),

  getCampaignPerformance: procedure.query(async () => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: {
            name: { in: ['active', 'completed'] }
          }
        },
        include: {
          currency: true,
          statistics: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 10
      });

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        goalAmount: Number(campaign.goal_amount),
        raisedAmount: campaign.statistics ? Number(campaign.statistics.current_amount) : 0,
        progress: campaign.statistics 
          ? Math.round((Number(campaign.statistics.current_amount) / Number(campaign.goal_amount)) * 100)
          : 0,
        currency: campaign.currency.symbol,
        donorCount: campaign.statistics?.unique_donors_count || 0
      }));
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      return [];
    }
  })
});
