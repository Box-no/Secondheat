// Sanity schema for products - uncomment when CMS is activated

/*
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price (NOK)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'size',
      title: 'Size',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['top', 'bottom', 'dress', 'shoes', 'accessories'],
      },
    },
    {
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: ['new', 'like_new', 'good', 'fair'],
      },
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
}
*/

export {}
