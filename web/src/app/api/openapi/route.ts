import { NextResponse } from 'next/server'

// Force dynamic rendering to avoid build-time generation issues
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Dynamic import to avoid build-time issues
    const { getOpenApiDocument } = await import('@/trpc/openapi')
    const openApiDocument = getOpenApiDocument()
    return NextResponse.json(openApiDocument)
  } catch (error) {
    console.error('Error generating OpenAPI document:', error)
    return NextResponse.json({
      openapi: '3.0.3',
      info: {
        title: 'Wamumbi Charity Management API',
        version: '1.0.0',
        description: 'API documentation generation failed. Please ensure all procedures have proper input/output schemas.'
      },
      paths: {},
      components: {}
    })
  }
}