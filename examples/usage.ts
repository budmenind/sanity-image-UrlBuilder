/**
 * Example usage of the Sanity Image URL Generator Plugin
 */

// ============================================
// 1. Plugin Configuration
// ============================================

import {defineConfig} from 'sanity'
import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'

export default defineConfig({
  name: 'default',
  title: 'My Sanity Project',
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [
    imageUrlGenerator({
      defaultAspectRatio: '16:9',
      defaultWidths: [640, 1024, 1600],
      defaultQuality: 75,
    }),
  ],
})

// ============================================
// 2. Schema Definition
// ============================================

import {defineType, defineField} from 'sanity'

// Basic usage - single image field
export const blogPost = defineType({
  name: 'blogPost',
  type: 'document',
  title: 'Blog Post',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'heroImage',
      type: 'imageUrlGenerator',
      title: 'Hero Image',
      description: 'Main image for the blog post',
    }),
    defineField({
      name: 'content',
      type: 'text',
      title: 'Content',
    }),
  ],
})

// Advanced usage - multiple image types
export const product = defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Product Name',
    }),
    defineField({
      name: 'heroImage',
      type: 'imageUrlGenerator',
      title: 'Hero Image',
      description: 'Main product image',
    }),
    defineField({
      name: 'thumbnail',
      type: 'imageUrlGenerator',
      title: 'Thumbnail',
      description: 'Small preview image',
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Image Gallery',
      of: [{type: 'imageUrlGenerator'}],
    }),
  ],
})

// ============================================
// 3. Programmatic Usage
// ============================================

import {
  buildImageUrl,
  buildResponsiveHtml,
  buildMarkdown,
  buildJson,
  buildAllMarkup,
} from 'sanity-plugin-image-url-generator'

// Example function to generate URLs for a blog post
async function generateBlogPostImageUrls(client: any, postId: string) {
  // Fetch the blog post
  const post = await client.fetch(
    `*[_type == "blogPost" && _id == $postId][0]{
      title,
      heroImage {
        asset->,
        crop,
        hotspot,
        alt
      }
    }`,
    {postId}
  )

  if (!post.heroImage?.asset) {
    return null
  }

  // Generate a single URL
  const singleUrl = buildImageUrl({
    projectId: 'your-project-id',
    dataset: 'production',
    asset: post.heroImage.asset,
    width: 1200,
    aspectRatio: '16:9',
    fit: 'clip',
    quality: 80,
    crop: post.heroImage.crop,
    hotspot: post.heroImage.hotspot,
  })

  // Generate responsive HTML
  const html = buildResponsiveHtml({
    projectId: 'your-project-id',
    dataset: 'production',
    asset: post.heroImage.asset,
    widths: [320, 640, 1024, 1600],
    aspectRatio: '16:9',
    alt: post.heroImage.alt || post.title,
    fit: 'clip',
    quality: 80,
    crop: post.heroImage.crop,
    hotspot: post.heroImage.hotspot,
  })

  // Generate all formats at once
  const allFormats = buildAllMarkup({
    projectId: 'your-project-id',
    dataset: 'production',
    asset: post.heroImage.asset,
    widths: [320, 640, 1024, 1600],
    aspectRatio: '16:9',
    alt: post.heroImage.alt || post.title,
    fit: 'clip',
    quality: 80,
    crop: post.heroImage.crop,
    hotspot: post.heroImage.hotspot,
  })

  return {
    singleUrl,
    html,
    markdown: allFormats.markdown,
    json: allFormats.json,
  }
}

// ============================================
// 4. Frontend Integration Examples
// ============================================

// React Component Example
import React from 'react'

interface BlogPostImageProps {
  image: {
    asset: any
    crop?: any
    hotspot?: any
    alt?: string
  }
  title: string
}

function BlogPostImage({image, title}: BlogPostImageProps) {
  const projectId = 'your-project-id'
  const dataset = 'production'

  if (!image?.asset) return null

  const html = buildResponsiveHtml({
    projectId,
    dataset,
    asset: image.asset,
    widths: [320, 640, 1024, 1600],
    aspectRatio: '16:9',
    alt: image.alt || title,
    fit: 'clip',
    quality: 80,
    crop: image.crop,
    hotspot: image.hotspot,
  })

  return <div dangerouslySetInnerHTML={{__html: html}} />
}

// Next.js Image Component Example
import Image from 'next/image'
import {buildImageUrl} from 'sanity-plugin-image-url-generator'

function NextJsBlogImage({image, title}: BlogPostImageProps) {
  const projectId = 'your-project-id'
  const dataset = 'production'

  if (!image?.asset) return null

  const imageUrl = buildImageUrl({
    projectId,
    dataset,
    asset: image.asset,
    width: 1600,
    aspectRatio: '16:9',
    fit: 'clip',
    quality: 80,
    crop: image.crop,
    hotspot: image.hotspot,
  })

  return (
    <Image
      src={imageUrl}
      alt={image.alt || title}
      width={1600}
      height={900}
      loading="lazy"
    />
  )
}

// ============================================
// 5. Custom Aspect Ratios
// ============================================

export const customRatioConfig = defineConfig({
  // ...other config
  plugins: [
    imageUrlGenerator({
      customAspectRatios: [
        {label: '16:9 (Widescreen)', value: '16:9'},
        {label: '9:16 (Stories)', value: '9:16'},
        {label: '1:1 (Square)', value: '1:1'},
        {label: '4:5 (Instagram Portrait)', value: '4:5'},
        {label: '21:9 (Ultrawide)', value: '21:9'},
      ],
    }),
  ],
})

// ============================================
// 6. Custom Width Presets
// ============================================

export const customWidthsConfig = defineConfig({
  // ...other config
  plugins: [
    imageUrlGenerator({
      customWidths: [375, 768, 1024, 1440, 1920, 2560],
      defaultWidths: [768, 1440, 1920],
    }),
  ],
})

// ============================================
// 7. Image Gallery Example
// ============================================

async function generateGalleryImages(client: any, productId: string) {
  const product = await client.fetch(
    `*[_type == "product" && _id == $productId][0]{
      name,
      gallery[] {
        asset->,
        crop,
        hotspot,
        alt
      }
    }`,
    {productId}
  )

  if (!product.gallery) return []

  return product.gallery.map((image: any) => {
    if (!image.asset) return null

    return buildAllMarkup({
      projectId: 'your-project-id',
      dataset: 'production',
      asset: image.asset,
      widths: [320, 640, 1024],
      aspectRatio: '1:1',
      alt: image.alt || product.name,
      fit: 'crop',
      quality: 85,
      crop: image.crop,
      hotspot: image.hotspot,
    })
  }).filter(Boolean)
}

// Export examples
export {
  generateBlogPostImageUrls,
  generateGalleryImages,
  BlogPostImage,
  NextJsBlogImage,
}
