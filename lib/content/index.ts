import { mockPages, mockFAQ, PageContent, FAQ } from '@/lib/mock/content'

export async function getPage(slug: string): Promise<PageContent | null> {
  // TODO: Replace with Sanity query
  // const page = await sanityClient.fetch(pageQuery, { slug })
  return mockPages[slug] || null
}

export async function getFAQ(): Promise<FAQ[]> {
  // TODO: Replace with Sanity query
  // const faqs = await sanityClient.fetch(faqQuery)
  return mockFAQ
}

export async function getHowItWorks(): Promise<PageContent | null> {
  return getPage('how-it-works')
}
