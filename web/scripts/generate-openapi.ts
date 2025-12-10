/**
 * Script to generate OpenAPI documentation as a static JSON file
 * Run with: npx tsx scripts/generate-openapi.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'

// Import the OpenAPI document generator
async function generateDocs() {
  try {
    // Dynamic import to handle ESM/CJS compatibility
    const { getOpenApiDocument } = await import('../src/trpc/openapi')
    
    const doc = getOpenApiDocument()
    
    // Write to public folder for static serving
    const outputPath = join(process.cwd(), 'public', 'openapi.json')
    writeFileSync(outputPath, JSON.stringify(doc, null, 2))
    
    console.log('✅ OpenAPI documentation generated successfully!')
    console.log(`📄 Output: ${outputPath}`)
    console.log(`\n📊 API Summary:`)
    console.log(`   Title: ${doc.info?.title}`)
    console.log(`   Version: ${doc.info?.version}`)
    console.log(`   Paths: ${Object.keys(doc.paths || {}).length} endpoints`)
    
    // List all endpoints
    if (doc.paths) {
      console.log('\n📋 Endpoints:')
      for (const [path, methods] of Object.entries(doc.paths)) {
        for (const [method, details] of Object.entries(methods as Record<string, { summary?: string }>)) {
          if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
            console.log(`   ${method.toUpperCase().padEnd(7)} ${path} - ${details.summary || 'No summary'}`)
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error generating OpenAPI documentation:', error)
    process.exit(1)
  }
}

generateDocs()
