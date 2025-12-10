import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const eventsRouter = router({
  getUpcoming: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/events/upcoming',
        tags: ['events'],
        summary: 'Get upcoming events',
        description: 'Retrieves upcoming events'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      eventDate: z.date(),
      capacity: z.number(),
      registrationsCount: z.number(),
      availableSpots: z.number(),
      ticketPrice: z.number(),
      imageUrl: z.string().nullable(),
      registrationDeadline: z.date().nullable(),
      status: z.string(),
      category: z.string(),
      location: z.string()
    })))
    .query(async () => {
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
          address: true,
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
        ticketPrice: Number(event.ticket_price),
        imageUrl: event.image_url,
        registrationDeadline: event.registration_deadline,
        status: event.status.name,
        category: event.category.name,
        location: event.address ? `${event.address.city}, ${event.address.country}` : 'TBD'
      }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }),

  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/events',
        tags: ['events'],
        summary: 'Get all events',
        description: 'Retrieves all events with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      eventDate: z.date(),
      capacity: z.number(),
      registrationsCount: z.number(),
      availableSpots: z.number(),
      ticketPrice: z.number(),
      currency: z.string(),
      imageUrl: z.string().nullable(),
      registrationDeadline: z.date().nullable(),
      status: z.string(),
      statusId: z.number(),
      category: z.string(),
      categoryId: z.number(),
      location: z.string(),
      createdAt: z.date()
    })))
    .query(async () => {
    try {
      const events = await prisma.event.findMany({
        include: {
          category: true,
          status: true,
          currency: true,
          address: true,
          _count: {
            select: {
              registrations: true
            }
          }
        },
        orderBy: {
          event_date: 'desc'
        }
      });

      return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        capacity: event.capacity,
        registrationsCount: event._count.registrations,
        availableSpots: event.capacity - event._count.registrations,
        ticketPrice: Number(event.ticket_price),
        currency: event.currency.code,
        imageUrl: event.image_url,
        registrationDeadline: event.registration_deadline,
        status: event.status.name,
        statusId: event.status_id,
        category: event.category.name,
        categoryId: event.category_id,
        location: event.address ? `${event.address.street_line_1 || ''}, ${event.address.city}, ${event.address.country}` : 'TBD',
        createdAt: event.created_at
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/events/{id}',
        tags: ['events'],
        summary: 'Get event by ID',
        description: 'Retrieves a specific event by its ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      eventDate: z.date(),
      capacity: z.number(),
      registrationsCount: z.number(),
      availableSpots: z.number(),
      ticketPrice: z.number(),
      currency: z.string(),
      currencyId: z.number(),
      imageUrl: z.string().nullable(),
      registrationDeadline: z.date().nullable(),
      status: z.string(),
      statusId: z.number(),
      category: z.string(),
      categoryId: z.number(),
      address: z.object({
        street: z.string().nullable(),
        city: z.string().nullable(),
        state: z.string().nullable(),
        postalCode: z.string().nullable(),
        country: z.string().nullable()
      }).nullable(),
      creator: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string()
      }).nullable(),
      registrations: z.array(z.object({
        id: z.number(),
        userId: z.number(),
        userName: z.string(),
        userEmail: z.string(),
        status: z.string(),
        registrationDate: z.date()
      })),
      createdAt: z.date(),
      updatedAt: z.date()
    }))
    .query(async ({ input }) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          status: true,
          currency: true,
          address: true,
          creator: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true
            }
          },
          registrations: {
            include: {
              user: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  email: true
                }
              },
              status: true
            },
            orderBy: {
              registration_date: 'desc'
            },
            take: 20
          }
        }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        capacity: event.capacity,
        registrationsCount: event.registrations.length,
        availableSpots: event.capacity - event.registrations.length,
        ticketPrice: Number(event.ticket_price),
        currency: event.currency.code,
        currencyId: event.currency_id,
        imageUrl: event.image_url,
        registrationDeadline: event.registration_deadline,
        status: event.status.name,
        statusId: event.status_id,
        category: event.category.name,
        categoryId: event.category_id,
        address: event.address ? {
          street: event.address.street_line_1,
          city: event.address.city,
          state: event.address.state,
          postalCode: event.address.postal_code,
          country: event.address.country
        } : null,
        creator: event.creator ? {
          id: event.creator.id,
          name: `${event.creator.first_name || ''} ${event.creator.last_name || ''}`.trim(),
          email: event.creator.email
        } : null,
        registrations: event.registrations.map(reg => ({
          id: reg.id,
          userId: reg.user.id,
          userName: `${reg.user.first_name || ''} ${reg.user.last_name || ''}`.trim(),
          userEmail: reg.user.email,
          status: reg.status.name,
          registrationDate: reg.registration_date
        })),
        createdAt: event.created_at,
        updatedAt: event.updated_at
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }),

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/events',
        tags: ['events'],
        summary: 'Create event',
        description: 'Creates a new event'
      }
    })
    .input(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    eventDate: z.coerce.date(),
    capacity: z.number().positive(),
    ticketPrice: z.number().min(0).default(0),
    currencyId: z.number(),
    categoryId: z.number(),
    imageUrl: z.string().optional(),
    registrationDeadline: z.coerce.date().optional(),
    addressId: z.number().optional(),
    createdBy: z.number().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      eventDate: z.date(),
      capacity: z.number(),
      ticketPrice: z.number(),
      currency: z.string(),
      status: z.string(),
      category: z.string(),
      createdAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Get scheduled status (default for new events)
      const scheduledStatus = await prisma.eventStatus.findFirst({
        where: { name: 'scheduled' }
      });

      // If no address provided, create a placeholder
      let addressId = input.addressId;
      if (!addressId) {
        const defaultAddress = await prisma.address.create({
          data: {
            city: 'TBD',
            country: 'TBD'
          }
        });
        addressId = defaultAddress.id;
      }

      const event = await prisma.event.create({
        data: {
          title: input.title,
          description: input.description,
          event_date: input.eventDate,
          capacity: input.capacity,
          ticket_price: input.ticketPrice,
          currency_id: input.currencyId,
          category_id: input.categoryId,
          status_id: scheduledStatus?.id || 1,
          image_url: input.imageUrl,
          registration_deadline: input.registrationDeadline,
          address_id: addressId,
          created_by: input.createdBy
        },
        include: {
          category: true,
          status: true,
          currency: true
        }
      });

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        capacity: event.capacity,
        ticketPrice: Number(event.ticket_price),
        currency: event.currency.code,
        status: event.status.name,
        category: event.category.name,
        createdAt: event.created_at
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }),

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/events/{id}',
        tags: ['events'],
        summary: 'Update event',
        description: 'Updates an existing event'
      }
    })
    .input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    eventDate: z.coerce.date().optional(),
    capacity: z.number().positive().optional(),
    ticketPrice: z.number().min(0).optional(),
    categoryId: z.number().optional(),
    statusId: z.number().optional(),
    imageUrl: z.string().optional(),
    registrationDeadline: z.coerce.date().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      eventDate: z.date(),
      capacity: z.number(),
      ticketPrice: z.number(),
      currency: z.string(),
      status: z.string(),
      category: z.string(),
      updatedAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      const { id, eventDate, ticketPrice, categoryId, statusId, imageUrl, registrationDeadline, ...rest } = input;
      
      const dataToUpdate: Record<string, unknown> = { ...rest };
      if (eventDate !== undefined) dataToUpdate.event_date = eventDate;
      if (ticketPrice !== undefined) dataToUpdate.ticket_price = ticketPrice;
      if (categoryId !== undefined) dataToUpdate.category_id = categoryId;
      if (statusId !== undefined) dataToUpdate.status_id = statusId;
      if (imageUrl !== undefined) dataToUpdate.image_url = imageUrl;
      if (registrationDeadline !== undefined) dataToUpdate.registration_deadline = registrationDeadline;

      const event = await prisma.event.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: true,
          status: true,
          currency: true
        }
      });

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        capacity: event.capacity,
        ticketPrice: Number(event.ticket_price),
        currency: event.currency.code,
        status: event.status.name,
        category: event.category.name,
        updatedAt: event.updated_at
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }),

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/events/{id}',
        tags: ['events'],
        summary: 'Delete event',
        description: 'Deletes an event by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      await prisma.event.delete({
        where: { id: input.id }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }),

  // Register user for an event
  register: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/events/{eventId}/register',
        tags: ['events'],
        summary: 'Register for event',
        description: 'Registers a user for an event'
      }
    })
    .input(z.object({
    eventId: z.number(),
    userId: z.number(),
    specialRequirements: z.string().optional()
  }))
    .output(z.object({
      id: z.number(),
      eventTitle: z.string(),
      userName: z.string(),
      status: z.string(),
      registrationDate: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Check if event exists and has capacity
      const event = await prisma.event.findUnique({
        where: { id: input.eventId },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event._count.registrations >= event.capacity) {
        throw new Error('Event is at full capacity');
      }

      // Check registration deadline
      if (event.registration_deadline && new Date() > event.registration_deadline) {
        throw new Error('Registration deadline has passed');
      }

      // Get confirmed status
      const confirmedStatus = await prisma.registrationStatus.findFirst({
        where: { name: 'confirmed' }
      });

      // Get pending payment status
      const pendingPaymentStatus = await prisma.paymentStatus.findFirst({
        where: { name: 'pending' }
      });

      const registration = await prisma.eventRegistration.create({
        data: {
          event_id: input.eventId,
          user_id: input.userId,
          status_id: confirmedStatus?.id || 1,
          payment_status_id: pendingPaymentStatus?.id || 1,
          special_requirements: input.specialRequirements,
          registration_date: new Date()
        },
        include: {
          event: true,
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true
            }
          },
          status: true
        }
      });

      return {
        id: registration.id,
        eventTitle: registration.event.title,
        userName: `${registration.user.first_name || ''} ${registration.user.last_name || ''}`.trim(),
        status: registration.status.name,
        registrationDate: registration.registration_date
      };
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }),

  // Cancel registration
  cancelRegistration: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/events/registrations/{registrationId}',
        tags: ['events'],
        summary: 'Cancel registration',
        description: 'Cancels an event registration'
      }
    })
    .input(z.object({
    registrationId: z.number()
  }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      const cancelledStatus = await prisma.registrationStatus.findFirst({
        where: { name: 'cancelled' }
      });

      await prisma.eventRegistration.update({
        where: { id: input.registrationId },
        data: {
          status_id: cancelledStatus?.id || 4
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling registration:', error);
      throw new Error('Failed to cancel registration');
    }
  }),

  getCategories: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/events/categories',
        tags: ['events'],
        summary: 'Get event categories',
        description: 'Retrieves all active event categories'
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
          type: 'event',
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
        path: '/events/statuses',
        tags: ['events'],
        summary: 'Get event statuses',
        description: 'Retrieves all active event statuses'
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
      const statuses = await prisma.eventStatus.findMany({
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
