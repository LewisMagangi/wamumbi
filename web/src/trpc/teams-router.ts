import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const teamsRouter = router({
  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/teams',
        tags: ['teams'],
        summary: 'Get all teams',
        description: 'Retrieves all teams with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      category: z.string(),
      categoryId: z.number(),
      status: z.string(),
      maxMembers: z.number().nullable(),
      membersCount: z.number(),
      projectsCount: z.number(),
      leader: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        imageUrl: z.string().nullable()
      }).nullable(),
      createdAt: z.date()
    })))
    .query(async () => {
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

  // Get team overview for dashboard
  getOverview: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/teams/overview',
        tags: ['teams'],
        summary: 'Get team overview',
        description: 'Retrieves a brief overview of teams for dashboard display'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      membersCount: z.number(),
      leader: z.object({
        name: z.string(),
        imageUrl: z.string().nullable()
      }).nullable()
    })))
    .query(async () => {
      try {
        const teams = await prisma.team.findMany({
          where: {
            status: 'active'
          },
          include: {
            leader: {
              select: {
                first_name: true,
                last_name: true,
                profile_image: true
              }
            },
            _count: {
              select: {
                members: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 5
        });

        return teams.map(team => ({
          id: team.id,
          name: team.name,
          membersCount: team._count.members,
          leader: team.leader ? {
            name: `${team.leader.first_name || ''} ${team.leader.last_name || ''}`.trim(),
            imageUrl: team.leader.profile_image
          } : null
        }));
      } catch (error) {
        console.error('Error fetching team overview:', error);
        return [];
      }
    }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/teams/{id}',
        tags: ['teams'],
        summary: 'Get team by ID',
        description: 'Retrieves a specific team by its ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      category: z.string(),
      categoryId: z.number(),
      status: z.string(),
      maxMembers: z.number().nullable(),
      leader: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        imageUrl: z.string().nullable()
      }).nullable(),
      members: z.array(z.object({
        id: z.number(),
        userId: z.number(),
        name: z.string(),
        email: z.string(),
        imageUrl: z.string().nullable(),
        role: z.string().nullable(),
        status: z.string(),
        joinedAt: z.date()
      })),
      projects: z.array(z.object({
        id: z.number(),
        title: z.string(),
        status: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable()
      })),
      createdAt: z.date(),
      updatedAt: z.date()
    }))
    .query(async ({ input }) => {
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
              status: { select: { name: true } },
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
          status: project.status.name,
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

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/teams',
        tags: ['teams'],
        summary: 'Create team',
        description: 'Creates a new team'
      }
    })
    .input(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.number(),
    teamLeaderId: z.number().optional(),
    maxMembers: z.number().positive().optional()
  }))
    .output(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      category: z.string(),
      leader: z.string().nullable(),
      status: z.string(),
      createdAt: z.date()
    }))
    .mutation(async ({ input }) => {
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

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/teams/{id}',
        tags: ['teams'],
        summary: 'Update team',
        description: 'Updates an existing team'
      }
    })
    .input(z.object({
    id: z.number(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    categoryId: z.number().optional(),
    teamLeaderId: z.number().optional(),
    maxMembers: z.number().positive().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  }))
    .output(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      category: z.string(),
      leader: z.string().nullable(),
      status: z.string(),
      updatedAt: z.date()
    }))
    .mutation(async ({ input }) => {
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

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/teams/{id}',
        tags: ['teams'],
        summary: 'Delete team',
        description: 'Deletes a team by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
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
  addMember: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/teams/{teamId}/members',
        tags: ['teams'],
        summary: 'Add team member',
        description: 'Adds a new member to a team'
      }
    })
    .input(z.object({
    teamId: z.number(),
    userId: z.number(),
    role: z.string().optional()
  }))
    .output(z.object({
      id: z.number(),
      teamId: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.string().nullable(),
      joinedAt: z.date()
    }))
    .mutation(async ({ input }) => {
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
  removeMember: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/teams/{teamId}/members/{userId}',
        tags: ['teams'],
        summary: 'Remove team member',
        description: 'Removes a member from a team'
      }
    })
    .input(z.object({
    teamId: z.number(),
    userId: z.number()
  }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
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
  updateMember: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/teams/members/{memberId}',
        tags: ['teams'],
        summary: 'Update team member',
        description: 'Updates a team member role or status'
      }
    })
    .input(z.object({
    memberId: z.number(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional()
  }))
    .output(z.object({
      id: z.number(),
      name: z.string(),
      role: z.string().nullable(),
      status: z.string()
    }))
    .mutation(async ({ input }) => {
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

  getCategories: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/teams/categories',
        tags: ['teams'],
        summary: 'Get team categories',
        description: 'Retrieves all active team categories'
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
