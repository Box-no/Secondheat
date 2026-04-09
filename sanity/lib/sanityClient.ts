// Sanity client - uncomment when CMS is activated
// To use: import and call in lib/content/index.ts

/*
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Example GROQ queries
export const pageQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    slug,
    content,
    sections[] {
      heading,
      body
    }
  }
`

export const faqQuery = `
  *[_type == "faq"] {
    question,
    answer
  }
`
*/

export {}
