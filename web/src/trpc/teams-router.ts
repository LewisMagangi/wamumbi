import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const teamsRouter = router({
  getAll: procedure.query(async () => {
    try {
      const teams = await prisma.team.findMany({
        include: {
          category: true,
          leader: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profile_image: true
            }
          },
          _count: {
            select: {
              members: true,
              projects: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        category: team.category.name,
        categoryId: team.category_id,
        status: team.status,
        maxMembers: team.max_members,
        membersCount: team._count.members,
        projectsCount: team._count.projects,
        leader: team.leader ? {
          id: team.leader.id,
          name: `${team.leader.first_name || ''} ${team.leader.last_name || ''}`.trim(),
          email: team.leader.email,
          imageUrl: team.leader.profile_image
        } : null,
        createdAt: team.created_at
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }),

  getById: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const team = await prisma.team.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          leader: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profile_image: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                  profile_image: true
                }
              }
            },
            orderBy: {
              joined_at: 'desc'
            }
          },
          projects: {
            select: {
              id: true,
              title: true,
              status: true,
              start_date: true,
              end_date: true
            },
            take: 10
          }
        }
      });

      if (!team) {
        throw new Error('Team not found');
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        category: team.category.name,
        categoryId: team.category_id,
        status: team.status,
        maxMembers: team.max_members,
        leader: team.leader ? {
          id: team.leader.id,
          name: `${team.leader.first_name || ''} ${team.leader.last_name || ''}`.trim(),
          email: team.leader.email,
          imageUrl: team.leader.profile_image
        } : null,
        members: team.members.map(member => ({
          id: member.id,
          userId: member.user.id,
          name: `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim(),
          email: member.user.email,
          imageUrl: member.user.profile_image,
          role: member.role,
          status: member.status,
          joinedAt: member.joined_at
        })),
        projects: team.projects.map(project => ({
          id: project.id,
          title: project.title,
          status: project.status,
          startDate: project.start_date,
          endDate: project.end_date
        })),
        createdAt: team.created_at,
        updatedAt: team.updated_at
      };
    } catch (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team');
    }
  }),

  create: procedure.input(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.number(),
    teamLeaderId: z.number().optional(),
    maxMembers: z.number().positive().optional()
  })).mutation(async ({ input }) => {
    try {
      const team = await prisma.team.create({
        data: {
          name: input.name,
          description: input.description,
          category_id: input.categoryId,
          team_leader_id: input.teamLeaderId,
          max_members: input.maxMembers,
          status: 'active'
        },
        include: {
          category: true,
          leader: {
            select: {
              first_name: true,
              last_name: true
            }
          }
        }
      });

      // If a leader was specified, add them as a member too
      if (input.teamLeaderId) {
        await prisma.teamMember.create({
          data: {
            team_id: team.id,
            user_id: input.teamLeaderId,
            role: 'Team Leader',
            status: 'active'
          }
        });
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        category: team.category.name,
        leader: team.leader ? `${team.leader.first_name || ''} ${team.leader.last_name || ''}`.trim() : null,
        status: team.status,
        createdAt: team.created_at
      };
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }),

  update: procedure.input(z.object({
    id: z.number(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    categoryId: z.number().optional(),
    teamLeaderId: z.number().optional(),
    maxMembers: z.number().positive().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  })).mutation(async ({ input }) => {
    try {
      const { id, categoryId, teamLeaderId, maxMembers, ...rest } = input;
      
      const dataToUpdate: Record<string, unknown> = { ...rest };
      if (categoryId !== undefined) dataToUpdate.category_id = categoryId;
      if (teamLeaderId !== undefined) dataToUpdate.team_leader_id = teamLeaderId;
      if (maxMembers !== undefined) dataToUpdate.max_members = maxMembers;

      const team = await prisma.team.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: true,
          leader: {
            select: {
              first_name: true,
              last_name: true
            }
          }
        }
      });

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        category: team.category.name,
        leader: team.leader ? `${team.leader.first_name || ''} ${team.leader.last_name || ''}`.trim() : null,
        status: team.status,
        updatedAt: team.updated_at
      };
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }
  }),

  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await prisma.team.delete({
        where: { id: input.id }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team');
    }
  }),

  // Add member to team
  addMember: procedure.input(z.object({
    teamId: z.number(),
    userId: z.number(),
    role: z.string().optional()
  })).mutation(async ({ input }) => {
    try {
      // Check if team has capacity
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        include: {
          _count: {
            select: { members: true }
          }
        }
      });

      if (!team) {
        throw new Error('Team not found');
      }

      if (team.max_members && team._count.members >= team.max_members) {
        throw new Error('Team is at full capacity');
      }

      const member = await prisma.teamMember.create({
        data: {
          team_id: input.teamId,
          user_id: input.userId,
          role: input.role,
          status: 'active'
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true
            }
          }
        }
      });

      return {
        id: member.id,
        teamId: member.team_id,
        name: `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim(),
        email: member.user.email,
        role: member.role,
        joinedAt: member.joined_at
      };
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }),

  // Remove member from team
  removeMember: procedure.input(z.object({
    teamId: z.number(),
    userId: z.number()
  })).mutation(async ({ input }) => {
    try {
      await prisma.teamMember.deleteMany({
        where: {
          team_id: input.teamId,
          user_id: input.userId
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error removing team member:', error);
      throw new Error('Failed to remove team member');
    }
  }),

  // Update member status/role
  updateMember: procedure.input(z.object({
    memberId: z.number(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional()
  })).mutation(async ({ input }) => {
    try {
      const { memberId, role, status } = input;

      const dataToUpdate: Record<string, unknown> = {};
      if (role !== undefined) dataToUpdate.role = role;
      if (status !== undefined) dataToUpdate.status = status;

      const member = await prisma.teamMember.update({
        where: { id: memberId },
        data: dataToUpdate,
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true
            }
          }
        }
      });

      return {
        id: member.id,
        name: `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim(),
        role: member.role,
        status: member.status
      };
    } catch (error) {
      console.error('Error updating team member:', error);
      throw new Error('Failed to update team member');
    }
  }),

  getCategories: procedure.query(async () => {
    try {
      const categories = await prisma.category.findMany({
        where: { 
          type: 'team',
          is_active: true 
        },
        orderBy: { display_order: 'asc' }
      });
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  })
});
