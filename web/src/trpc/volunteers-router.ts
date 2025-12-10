import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const volunteersRouter = router({
  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/volunteers',
        tags: ['volunteers'],
        summary: 'Get all volunteers',
        description: 'Retrieves all volunteers with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      profileImage: z.string().nullable(),
      availability: z.string().nullable(),
      skills: z.array(z.string()),
      status: z.string(),
      totalHours: z.union([z.number(), z.any()]),
      activitiesCount: z.number(),
      joinedAt: z.date()
    })))
    .query(async () => {
    try {
      const volunteers = await prisma.volunteer.findMany({
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              profile_image: true
            }
          },
          emergency_contact: true,
          statistics: true,
          status: true,
          skill_assignments: {
            include: {
              skill: true
            }
          },
          _count: {
            select: {
              activities: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return volunteers.map(volunteer => ({
        id: volunteer.id,
        userId: volunteer.user.id,
        name: `${volunteer.user.first_name || ''} ${volunteer.user.last_name || ''}`.trim(),
        email: volunteer.user.email,
        phone: volunteer.user.phone,
        profileImage: volunteer.user.profile_image,
        availability: volunteer.availability,
        skills: volunteer.skill_assignments.map(sa => sa.skill.name),
        status: volunteer.status.name,
        totalHours: volunteer.statistics?.total_hours || 0,
        activitiesCount: volunteer._count.activities,
        joinedAt: volunteer.created_at
      }));
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return [];
    }
  }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/volunteers/{id}',
        tags: ['volunteers'],
        summary: 'Get volunteer by ID',
        description: 'Retrieves a specific volunteer by their ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      profileImage: z.string().nullable(),
      availability: z.string().nullable(),
      skills: z.array(z.string()),
      status: z.string(),
      joinedAt: z.date(),
      emergencyContact: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().nullable(),
        relationship: z.string()
      }).nullable(),
      statistics: z.any().nullable(),
      recentActivities: z.array(z.object({
        id: z.number(),
        description: z.string(),
        hoursLogged: z.number(),
        activityDate: z.date(),
        activityType: z.string(),
        projectTitle: z.string().nullable().optional(),
        eventTitle: z.string().nullable().optional(),
        verified: z.boolean()
      }))
    }))
    .query(async ({ input }) => {
    try {
      const volunteer = await prisma.volunteer.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              profile_image: true
            }
          },
          emergency_contact: true,
          statistics: true,
          status: true,
          skill_assignments: {
            include: {
              skill: true
            }
          },
          activities: {
            include: {
              activity_type: true,
              project: true,
              event: true
            },
            orderBy: {
              activity_date: 'desc'
            },
            take: 10
          }
        }
      });

      if (!volunteer) {
        throw new Error('Volunteer not found');
      }

      return {
        id: volunteer.id,
        userId: volunteer.user.id,
        name: `${volunteer.user.first_name || ''} ${volunteer.user.last_name || ''}`.trim(),
        email: volunteer.user.email,
        phone: volunteer.user.phone,
        profileImage: volunteer.user.profile_image,
        availability: volunteer.availability,
        skills: volunteer.skill_assignments.map(sa => sa.skill.name),
        status: volunteer.status.name,
        joinedAt: volunteer.created_at,
        emergencyContact: volunteer.emergency_contact ? {
          name: volunteer.emergency_contact.name,
          phone: volunteer.emergency_contact.phone,
          email: volunteer.emergency_contact.email,
          relationship: volunteer.emergency_contact.relationship
        } : null,
        statistics: volunteer.statistics,
        recentActivities: volunteer.activities.map(activity => ({
          id: activity.id,
          description: activity.description,
          hoursLogged: Number(activity.hours_logged),
          activityDate: activity.activity_date,
          activityType: activity.activity_type.name,
          projectTitle: activity.project?.title,
          eventTitle: activity.event?.title,
          verified: activity.verified_by !== null
        }))
      };
    } catch (error) {
      console.error('Error fetching volunteer:', error);
      throw new Error('Failed to fetch volunteer');
    }
  }),

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/volunteers',
        tags: ['volunteers'],
        summary: 'Create volunteer',
        description: 'Creates a new volunteer'
      }
    })
    .input(z.object({
    userId: z.number(),
    availability: z.string().optional(),
    skillIds: z.array(z.number()).optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyContactEmail: z.string().optional(),
    emergencyContactRelationship: z.string().optional()
  }))
    .output(z.object({
      id: z.number(),
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      profileImage: z.string().nullable(),
      availability: z.string().nullable(),
      skills: z.array(z.string()),
      status: z.string(),
      joinedAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Create emergency contact if provided
      let emergencyContactId: number | undefined;
      if (input.emergencyContactName && input.emergencyContactPhone) {
        const emergencyContact = await prisma.emergencyContact.create({
          data: {
            name: input.emergencyContactName,
            phone: input.emergencyContactPhone,
            email: input.emergencyContactEmail,
            relationship: input.emergencyContactRelationship || 'Other'
          }
        });
        emergencyContactId = emergencyContact.id;
      }

      // Get default status (active)
      const activeStatus = await prisma.volunteerStatus.findFirst({
        where: { name: 'active' }
      });

      // Get default background check status (pending)
      const pendingBgCheck = await prisma.backgroundCheckStatus.findFirst({
        where: { name: 'pending' }
      });

      const volunteer = await prisma.volunteer.create({
        data: {
          user_id: input.userId,
          availability: input.availability,
          emergency_contact_id: emergencyContactId,
          status_id: activeStatus?.id || 1,
          background_check_status_id: pendingBgCheck?.id || 1,
          joined_date: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              profile_image: true
            }
          },
          status: true,
          statistics: true
        }
      });

      // Create skill assignments if provided
      if (input.skillIds && input.skillIds.length > 0) {
        await prisma.volunteerSkillAssignment.createMany({
          data: input.skillIds.map(skillId => ({
            volunteer_id: volunteer.id,
            skill_id: skillId
          }))
        });
      }

      // Create initial statistics record
      await prisma.volunteerStatistics.create({
        data: {
          volunteer_id: volunteer.id,
          total_hours: 0,
          activities_count: 0,
          projects_count: 0,
          events_count: 0,
          teams_count: 0
        }
      });

      return {
        id: volunteer.id,
        userId: volunteer.user.id,
        name: `${volunteer.user.first_name || ''} ${volunteer.user.last_name || ''}`.trim(),
        email: volunteer.user.email,
        phone: volunteer.user.phone,
        profileImage: volunteer.user.profile_image,
        availability: volunteer.availability,
        skills: [],
        status: volunteer.status.name,
        joinedAt: volunteer.created_at
      };
    } catch (error) {
      console.error('Error creating volunteer:', error);
      throw new Error('Failed to create volunteer');
    }
  }),

  // Create a volunteer with a new user in one transaction
  createWithUser: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/volunteers/register',
        tags: ['volunteers'],
        summary: 'Register new volunteer',
        description: 'Creates a new user and volunteer record in one transaction'
      }
    })
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      availability: z.string().optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      emergencyContactEmail: z.string().optional(),
      emergencyContactRelationship: z.string().optional()
    }))
    .output(z.object({
      id: z.number(),
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      profileImage: z.string().nullable(),
      availability: z.string().nullable(),
      skills: z.array(z.string()),
      status: z.string(),
      joinedAt: z.date()
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if user with email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email }
        });
        
        if (existingUser) {
          throw new Error('A user with this email already exists');
        }

        // Get default role (volunteer)
        const volunteerRole = await prisma.userRole.findFirst({
          where: { name: 'volunteer' }
        });

        // Get default user status (active)
        const activeUserStatus = await prisma.userStatus.findFirst({
          where: { name: 'active' }
        });

        // Create user first
        const user = await prisma.user.create({
          data: {
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            phone: input.phone || null,
            role_id: volunteerRole?.id || 3, // Default to volunteer role
            status_id: activeUserStatus?.id || 1, // Default to active status
            password_hash: 'pending_setup', // User will need to set password later
            email_verified: false
          }
        });

        // Create emergency contact if provided
        let emergencyContactId: number | undefined;
        if (input.emergencyContactName && input.emergencyContactPhone) {
          const emergencyContact = await prisma.emergencyContact.create({
            data: {
              name: input.emergencyContactName,
              phone: input.emergencyContactPhone,
              email: input.emergencyContactEmail || null,
              relationship: input.emergencyContactRelationship || 'Other'
            }
          });
          emergencyContactId = emergencyContact.id;
        }

        // Get default status (active)
        const activeStatus = await prisma.volunteerStatus.findFirst({
          where: { name: 'active' }
        });

        // Get default background check status (pending)
        const pendingBgCheck = await prisma.backgroundCheckStatus.findFirst({
          where: { name: 'pending' }
        });

        // Create volunteer record
        const volunteer = await prisma.volunteer.create({
          data: {
            user_id: user.id,
            availability: input.availability || null,
            emergency_contact_id: emergencyContactId,
            status_id: activeStatus?.id || 1,
            background_check_status_id: pendingBgCheck?.id || 1,
            joined_date: new Date()
          },
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                profile_image: true
              }
            },
            status: true
          }
        });

        // Create initial statistics record
        await prisma.volunteerStatistics.create({
          data: {
            volunteer_id: volunteer.id,
            total_hours: 0,
            activities_count: 0,
            projects_count: 0,
            events_count: 0,
            teams_count: 0
          }
        });

        return {
          id: volunteer.id,
          userId: volunteer.user.id,
          name: `${volunteer.user.first_name || ''} ${volunteer.user.last_name || ''}`.trim(),
          email: volunteer.user.email,
          phone: volunteer.user.phone,
          profileImage: volunteer.user.profile_image,
          availability: volunteer.availability,
          skills: [],
          status: volunteer.status.name,
          joinedAt: volunteer.created_at
        };
      } catch (error) {
        console.error('Error creating volunteer with user:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to create volunteer');
      }
    }),

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/volunteers/{id}',
        tags: ['volunteers'],
        summary: 'Update volunteer',
        description: 'Updates an existing volunteer'
      }
    })
    .input(z.object({
    id: z.number(),
    availability: z.string().optional(),
    statusId: z.number().optional(),
    skillIds: z.array(z.number()).optional()
  }))
    .output(z.object({
      id: z.number(),
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      profileImage: z.string().nullable(),
      availability: z.string().nullable(),
      skills: z.array(z.string()),
      status: z.string()
    }))
    .mutation(async ({ input }) => {
    try {
      const { id, skillIds, statusId, ...updateData } = input;
      
      const dataToUpdate: { availability?: string; status_id?: number } = {};
      if (updateData.availability) dataToUpdate.availability = updateData.availability;
      if (statusId) dataToUpdate.status_id = statusId;

      const volunteer = await prisma.volunteer.update({
        where: { id },
        data: dataToUpdate,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              profile_image: true
            }
          },
          status: true,
          skill_assignments: {
            include: {
              skill: true
            }
          }
        }
      });

      // Update skills if provided
      if (skillIds) {
        // Remove existing skill assignments
        await prisma.volunteerSkillAssignment.deleteMany({
          where: { volunteer_id: id }
        });
        // Add new skill assignments
        if (skillIds.length > 0) {
          await prisma.volunteerSkillAssignment.createMany({
            data: skillIds.map(skillId => ({
              volunteer_id: id,
              skill_id: skillId
            }))
          });
        }
      }

      return {
        id: volunteer.id,
        userId: volunteer.user.id,
        name: `${volunteer.user.first_name || ''} ${volunteer.user.last_name || ''}`.trim(),
        email: volunteer.user.email,
        phone: volunteer.user.phone,
        profileImage: volunteer.user.profile_image,
        availability: volunteer.availability,
        skills: volunteer.skill_assignments.map(sa => sa.skill.name),
        status: volunteer.status.name
      };
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw new Error('Failed to update volunteer');
    }
  }),

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/volunteers/{id}',
        tags: ['volunteers'],
        summary: 'Delete volunteer',
        description: 'Deletes a volunteer by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      await prisma.volunteer.delete({
        where: { id: input.id }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw new Error('Failed to delete volunteer');
    }
  }),

  logActivity: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/volunteers/{volunteerId}/activities',
        tags: ['volunteers'],
        summary: 'Log volunteer activity',
        description: 'Logs a new activity for a volunteer'
      }
    })
    .input(z.object({
    volunteerId: z.number(),
    activityTypeId: z.number(),
    description: z.string().min(1),
    hoursLogged: z.number().positive(),
    activityDate: z.date(),
    projectId: z.number().optional(),
    eventId: z.number().optional()
  }))
    .output(z.object({
      id: z.number(),
      volunteer_id: z.number(),
      activity_type_id: z.number(),
      description: z.string(),
      hours_logged: z.any(),
      activity_date: z.date()
    }).passthrough())
    .mutation(async ({ input }) => {
    try {
      const activity = await prisma.volunteerActivity.create({
        data: {
          volunteer_id: input.volunteerId,
          activity_type_id: input.activityTypeId,
          description: input.description,
          hours_logged: input.hoursLogged,
          activity_date: input.activityDate,
          project_id: input.projectId,
          event_id: input.eventId
        },
        include: {
          activity_type: true,
          project: true,
          event: true
        }
      });

      // Update volunteer statistics
      await prisma.volunteerStatistics.update({
        where: { volunteer_id: input.volunteerId },
        data: {
          total_hours: {
            increment: input.hoursLogged
          },
          activities_count: {
            increment: 1
          },
          projects_count: input.projectId ? { increment: 1 } : undefined,
          events_count: input.eventId ? { increment: 1 } : undefined,
          last_activity_date: input.activityDate
        }
      });

      return activity;
    } catch (error) {
      console.error('Error logging volunteer activity:', error);
      throw new Error('Failed to log volunteer activity');
    }
  }),

  getSkills: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/volunteers/skills',
        tags: ['volunteers'],
        summary: 'Get volunteer skills',
        description: 'Retrieves all active volunteer skills'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      category: z.string().nullable(),
      is_active: z.boolean()
    })))
    .query(async () => {
    try {
      const skills = await prisma.volunteerSkill.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      return skills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }),

  getStatuses: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/volunteers/statuses',
        tags: ['volunteers'],
        summary: 'Get volunteer statuses',
        description: 'Retrieves all active volunteer statuses'
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
      const statuses = await prisma.volunteerStatus.findMany({
        where: { is_active: true },
        orderBy: { display_order: 'asc' }
      });
      return statuses;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return [];
    }
  })
});
