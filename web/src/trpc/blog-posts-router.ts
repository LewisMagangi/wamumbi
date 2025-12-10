import { procedure, router } from "./trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const blogPostsRouter = router({
  getAll: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/blog-posts',
        tags: ['blog'],
        summary: 'Get all blog posts',
        description: 'Retrieves all blog posts with details'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      title: z.string(),
      excerpt: z.string().nullable(),
      content: z.string(),
      featuredImage: z.string().nullable(),
      authorName: z.string(),
      authorImage: z.string().nullable().optional(),
      category: z.string(),
      status: z.string(),
      publishedAt: z.date().nullable(),
      createdAt: z.date()
    })))
    .query(async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        include: {
          category: true,
          status: true,
          author: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_image: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        authorName: post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'Unknown',
        authorImage: post.author?.profile_image,
        category: post.category.name,
        status: post.status.name,
        publishedAt: post.published_at,
        createdAt: post.created_at
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }),

  getPublished: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/blog-posts/published',
        tags: ['blog'],
        summary: 'Get published blog posts',
        description: 'Retrieves all published blog posts'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      title: z.string(),
      excerpt: z.string().nullable(),
      featuredImage: z.string().nullable(),
      authorName: z.string(),
      category: z.string(),
      publishedAt: z.date(),
      createdAt: z.date()
    })))
    .query(async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          status: {
            is_published: true
          },
          published_at: {
            not: null
          }
        },
        include: {
          category: true,
          author: {
            select: {
              first_name: true,
              last_name: true,
              profile_image: true
            }
          }
        },
        orderBy: {
          published_at: 'desc'
        },
        take: 10
      });

      return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        featuredImage: post.featured_image,
        authorName: post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'Unknown',
        category: post.category.name,
        publishedAt: post.published_at!,
        createdAt: post.created_at
      }));
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }
  }),

  getById: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/blog-posts/{id}',
        tags: ['blog'],
        summary: 'Get blog post by ID',
        description: 'Retrieves a specific blog post by its ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      excerpt: z.string().nullable(),
      content: z.string(),
      featuredImage: z.string().nullable(),
      author: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        imageUrl: z.string().nullable()
      }).nullable(),
      category: z.string(),
      categoryId: z.number(),
      status: z.string(),
      statusId: z.number(),
      publishedAt: z.date().nullable(),
      createdAt: z.date(),
      updatedAt: z.date()
    }))
    .query(async ({ input }) => {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          status: true,
          author: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              profile_image: true
            }
          }
        }
      });

      if (!post) {
        throw new Error('Blog post not found');
      }

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        author: post.author ? {
          id: post.author.id,
          name: `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim(),
          email: post.author.email,
          imageUrl: post.author.profile_image
        } : null,
        category: post.category.name,
        categoryId: post.category_id,
        status: post.status.name,
        statusId: post.status_id,
        publishedAt: post.published_at,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw new Error('Failed to fetch blog post');
    }
  }),

  create: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/blog-posts',
        tags: ['blog'],
        summary: 'Create blog post',
        description: 'Creates a new blog post'
      }
    })
    .input(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    categoryId: z.number(),
    featuredImage: z.string().optional(),
    authorId: z.number().optional(),
    publishedAt: z.date().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      excerpt: z.string().nullable(),
      content: z.string(),
      featuredImage: z.string().nullable(),
      authorName: z.string(),
      category: z.string(),
      status: z.string(),
      publishedAt: z.date().nullable(),
      createdAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      // Determine status based on publishedAt
      const draftStatus = await prisma.blogPostStatus.findFirst({
        where: { name: 'draft' }
      });
      const publishedStatus = await prisma.blogPostStatus.findFirst({
        where: { name: 'published' }
      });
      
      const statusId = input.publishedAt ? (publishedStatus?.id || 2) : (draftStatus?.id || 1);

      const post = await prisma.blogPost.create({
        data: {
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          category_id: input.categoryId,
          status_id: statusId,
          featured_image: input.featuredImage,
          author_id: input.authorId,
          published_at: input.publishedAt
        },
        include: {
          category: true,
          status: true,
          author: {
            select: {
              first_name: true,
              last_name: true,
              profile_image: true
            }
          }
        }
      });

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        authorName: post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'Unknown',
        category: post.category.name,
        status: post.status.name,
        publishedAt: post.published_at,
        createdAt: post.created_at
      };
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw new Error('Failed to create blog post');
    }
  }),

  update: procedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/blog-posts/{id}',
        tags: ['blog'],
        summary: 'Update blog post',
        description: 'Updates an existing blog post'
      }
    })
    .input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    categoryId: z.number().optional(),
    featuredImage: z.string().optional(),
    statusId: z.number().optional(),
    publishedAt: z.date().optional()
  }))
    .output(z.object({
      id: z.number(),
      title: z.string(),
      excerpt: z.string().nullable(),
      content: z.string(),
      featuredImage: z.string().nullable(),
      authorName: z.string(),
      category: z.string(),
      status: z.string(),
      publishedAt: z.date().nullable(),
      updatedAt: z.date()
    }))
    .mutation(async ({ input }) => {
    try {
      const { id, categoryId, statusId, featuredImage, publishedAt, ...rest } = input;
      
      const dataToUpdate: {
        title?: string;
        content?: string;
        excerpt?: string;
        category_id?: number;
        status_id?: number;
        featured_image?: string;
        published_at?: Date;
      } = { ...rest };
      
      if (categoryId) dataToUpdate.category_id = categoryId;
      if (statusId) dataToUpdate.status_id = statusId;
      if (featuredImage) dataToUpdate.featured_image = featuredImage;
      if (publishedAt) dataToUpdate.published_at = publishedAt;

      const post = await prisma.blogPost.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: true,
          status: true,
          author: {
            select: {
              first_name: true,
              last_name: true,
              profile_image: true
            }
          }
        }
      });

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        authorName: post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'Unknown',
        category: post.category.name,
        status: post.status.name,
        publishedAt: post.published_at,
        updatedAt: post.updated_at
      };
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw new Error('Failed to update blog post');
    }
  }),

  delete: procedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/blog-posts/{id}',
        tags: ['blog'],
        summary: 'Delete blog post',
        description: 'Deletes a blog post by ID'
      }
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
    try {
      await prisma.blogPost.delete({
        where: { id: input.id }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw new Error('Failed to delete blog post');
    }
  }),

  getCategories: procedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/blog-posts/categories',
        tags: ['blog'],
        summary: 'Get blog categories',
        description: 'Retrieves all active blog categories'
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
          type: 'blog',
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
        path: '/blog-posts/statuses',
        tags: ['blog'],
        summary: 'Get blog post statuses',
        description: 'Retrieves all active blog post statuses'
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      is_published: z.boolean(),
      is_active: z.boolean(),
      display_order: z.number()
    })))
    .query(async () => {
    try {
      const statuses = await prisma.blogPostStatus.findMany({
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
