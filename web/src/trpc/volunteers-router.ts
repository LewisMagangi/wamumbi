import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const volunteersRouter = router({
  getAll: procedure.query(async () => {
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

  getById: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
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

  create: procedure.input(z.object({
    userId: z.number(),
    availability: z.string().optional(),
    skillIds: z.array(z.number()).optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyContactEmail: z.string().optional(),
    emergencyContactRelationship: z.string().optional()
  })).mutation(async ({ input }) => {
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

  update: procedure.input(z.object({
    id: z.number(),
    availability: z.string().optional(),
    statusId: z.number().optional(),
    skillIds: z.array(z.number()).optional()
  })).mutation(async ({ input }) => {
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

  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
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

  logActivity: procedure.input(z.object({
    volunteerId: z.number(),
    activityTypeId: z.number(),
    description: z.string().min(1),
    hoursLogged: z.number().positive(),
    activityDate: z.date(),
    projectId: z.number().optional(),
    eventId: z.number().optional()
  })).mutation(async ({ input }) => {
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

  getSkills: procedure.query(async () => {
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

  getStatuses: procedure.query(async () => {
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
