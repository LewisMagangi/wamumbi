import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";

export const teamsRouter = router({
  getOverview: procedure.query(async () => {
    try {
      const teams = await prisma.team.findMany({
        include: {
          _count: {
            select: {
              members: true
            }
          }
        },
        take: 10
      });

      // Generate colors for teams
      const colors = ["#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#84CC16"];
      
      return teams.map((team, index) => ({
        id: team.id,
        name: team.name,
        memberCount: team._count.members,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Error fetching team overview:', error);
      return [];
    }
  }),

  getAll: procedure.query(async () => {
    try {
      const teams = await prisma.team.findMany({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true
                }
              }
            },
            take: 5 // Limit members shown in list view
          },
          _count: {
            select: {
              members: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description || '',
        membersCount: team._count.members,
        members: team.members.map(m => ({
          id: m.user.id,
          name: `${m.user.firstName} ${m.user.lastName}`,
          profileImage: m.user.imageUrl,
          role: m.role
        })),
        createdAt: team.createdAt
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }),

  getById: procedure.query(async () => {
    try {
      const team = await prisma.team.findFirst({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      });

      if (!team) {
        throw new Error('Team not found');
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description || '',
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        members: team.members.map(m => ({
          id: m.id,
          userId: m.user.id,
          name: `${m.user.firstName} ${m.user.lastName}`,
          email: m.user.email,
          profileImage: m.user.imageUrl,
          role: m.role,
          joinedAt: m.joinedAt
        }))
      };
    } catch (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team');
    }
  }),
});