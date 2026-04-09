// Sanity configuration - uncomment when CMS is ready
// To activate: npm install sanity @sanity/cli @sanity/desk-tool
// Then uncomment the code below

/*
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import product from './schemas/product'
import page from './schemas/page'
import faq from './schemas/faq'

export default defineConfig({
  name: 'secondheat',
  title: 'SecondHeat',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [product, page, faq],
  },
})
*/

export {}
