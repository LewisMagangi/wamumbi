import { generateOpenApiDocument } from 'trpc-to-openapi'
import { appRouter } from './index'

// Cache the generated document to avoid registry conflicts on regeneration
let cachedDocument: ReturnType<typeof generateOpenApiDocument> | null = null

// Function to generate OpenAPI document - wrapped in try-catch for safety
export function getOpenApiDocument() {
  // Return cached document if available to avoid registry conflicts
  if (cachedDocument) {
    return cachedDocument
  }
  
  try {
    cachedDocument = generateOpenApiDocument(appRouter, {
      title: 'Wamumbi Charity Management API',
      version: '1.0.0',
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://wamumbi.vercel.app/api'
        : 'http://localhost:3000/api',
      description: 'Type-safe API for charity management. This documentation is auto-generated from tRPC procedures with OpenAPI metadata.',
      tags: ['auth', 'campaigns', 'donations', 'teams', 'events', 'volunteers', 'blog', 'dashboard'],
      docsUrl: 'https://github.com/LewisMagangi/wamumbi'
    })
    return cachedDocument
  } catch (error) {
    console.error('Error generating OpenAPI document:', error)
    // Return a minimal valid OpenAPI document on error
    return {
      openapi: '3.0.3',
      info: {
        title: 'Wamumbi Charity Management API',
        version: '1.0.0',
        description: 'API documentation is being generated. Some procedures may be missing output schemas.'
      },
      paths: {},
      components: {}
    }
  }
}