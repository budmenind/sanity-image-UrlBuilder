# Sanity Image URL Generator Plugin

A powerful Sanity Studio v3 plugin that allows editors to select images from their media library, configure transformations, and generate copy-pastable responsive image URLs using Sanity's image transformation API.

## Features

- **Intuitive Image Selection**: Seamlessly integrates with Sanity's media library
- **Hotspot & Crop Support**: Respects Sanity's built-in hotspot and crop functionality
- **Flexible Aspect Ratios**: Choose from common presets or define custom ratios
- **Multiple Size Variants**: Generate URLs for multiple widths simultaneously
- **Format Options**: Auto, WebP, JPEG, PNG with quality control
- **Live Preview**: See your transformations in real-time
- **Copy-Paste Ready**: One-click copying for HTML, Markdown, and JSON formats
- **Responsive Markup**: Auto-generates complete `<img>` tags with srcset
- **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install sanity-plugin-image-url-generator
```

or

```bash
yarn add sanity-plugin-image-url-generator
```

## Quick Start

### 1. Add the plugin to your Sanity configuration

```typescript
// sanity.config.ts
import {defineConfig} from 'sanity'
import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'

export default defineConfig({
  // ... other config
  plugins: [
    imageUrlGenerator({
      defaultAspectRatio: '16:9',
      defaultWidths: [640, 1024, 1600],
      defaultQuality: 75,
    })
  ]
})
```

### 2. Use in your schema

```typescript
// schemas/myDocument.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  type: 'document',
  title: 'Blog Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'heroImage',
      type: 'imageUrlGenerator', // Use the custom type
      title: 'Hero Image'
    }
  ]
})
```

### 3. Start generating URLs!

Once configured, editors can:
1. Select or upload an image from the media library
2. Adjust hotspot and crop as needed
3. Configure aspect ratio, sizes, and quality
4. Copy the generated URLs in their preferred format

## Plugin Options

Configure default values when registering the plugin:

```typescript
interface PluginOptions {
  // Default aspect ratio (e.g., "16:9", "4:3", "1:1")
  defaultAspectRatio?: string

  // Default widths for responsive images
  defaultWidths?: number[]

  // Allowed image formats
  allowedFormats?: ('auto' | 'jpg' | 'png' | 'webp')[]

  // Default quality (1-100)
  defaultQuality?: number

  // Default fit mode
  defaultFit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'

  // Custom aspect ratio options
  customAspectRatios?: Array<{label: string; value: string}>

  // Custom width presets
  customWidths?: number[]
}
```

### Example with custom options:

```typescript
imageUrlGenerator({
  defaultAspectRatio: '16:9',
  defaultWidths: [375, 768, 1024, 1440, 1920],
  allowedFormats: ['auto', 'webp'],
  defaultQuality: 80,
  defaultFit: 'clip',
  customAspectRatios: [
    {label: '16:9 (Wide)', value: '16:9'},
    {label: '9:16 (Story)', value: '9:16'},
    {label: '1:1 (Square)', value: '1:1'}
  ],
  customWidths: [375, 768, 1024, 1440, 1920, 2560]
})
```

## Generated Output Examples

### HTML with srcset

```html
<img
  src="https://cdn.sanity.io/images/project/dataset/image-id-800x450.jpg?w=800&h=450&fit=clip&q=75"
  srcset="
    https://cdn.sanity.io/images/project/dataset/image-id-320x180.jpg?w=320&h=180&fit=clip&q=75 320w,
    https://cdn.sanity.io/images/project/dataset/image-id-640x360.jpg?w=640&h=360&fit=clip&q=75 640w,
    https://cdn.sanity.io/images/project/dataset/image-id-800x450.jpg?w=800&h=450&fit=clip&q=75 800w,
    https://cdn.sanity.io/images/project/dataset/image-id-1200x675.jpg?w=1200&h=675&fit=clip&q=75 1200w,
    https://cdn.sanity.io/images/project/dataset/image-id-1600x900.jpg?w=1600&h=900&fit=clip&q=75 1600w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Hero image"
  width="800"
  height="450"
  loading="lazy"
/>
```

### Markdown

```markdown
![Hero image](https://cdn.sanity.io/images/project/dataset/image-id.jpg?w=1600&h=900&fit=clip&q=75)
```

### JSON

```json
{
  "alt": "Hero image",
  "aspectRatio": "16:9",
  "fit": "clip",
  "quality": 75,
  "format": "auto",
  "sources": [
    {
      "url": "https://cdn.sanity.io/images/project/dataset/image-id.jpg?w=320&h=180&fit=clip&q=75",
      "width": 320,
      "height": 180
    },
    {
      "url": "https://cdn.sanity.io/images/project/dataset/image-id.jpg?w=640&h=360&fit=clip&q=75",
      "width": 640,
      "height": 360
    }
  ]
}
```

## Programmatic Usage

You can also use the utility functions directly in your code:

```typescript
import {
  buildImageUrl,
  buildResponsiveHtml,
  buildMarkdown,
  buildJson
} from 'sanity-plugin-image-url-generator'

// Build a single URL
const url = buildImageUrl({
  projectId: 'your-project',
  dataset: 'production',
  asset: imageAsset,
  width: 800,
  aspectRatio: '16:9',
  fit: 'clip',
  quality: 75
})

// Build responsive HTML
const html = buildResponsiveHtml({
  projectId: 'your-project',
  dataset: 'production',
  asset: imageAsset,
  widths: [320, 640, 1024],
  aspectRatio: '16:9',
  alt: 'My image',
  fit: 'clip',
  quality: 75
})
```

## Understanding Fit Modes

- **clip** (default): Preserves aspect ratio, crops if needed
- **crop**: Fills the entire size, crops to fit
- **fill**: Ignores aspect ratio, stretches to fill
- **fillmax**: Same as fill, but won't scale up
- **max**: Fit inside bounds, preserving aspect ratio
- **scale**: Scales to fit exactly (may distort)
- **min**: Scales down to fit, won't scale up

## Understanding Format Options

- **auto** (recommended): Sanity automatically serves the best format based on browser support
- **webp**: Modern format with excellent compression
- **jpg**: Universal support, good for photos
- **png**: Best for images with transparency

## Image Quality Guide

- **90-100**: Very high quality, large file sizes (use sparingly)
- **75-85**: Excellent quality, good balance (recommended)
- **60-74**: Good quality, smaller files
- **1-59**: Lower quality, smallest files (use for thumbnails)

## Common Aspect Ratios

- **16:9**: Widescreen (YouTube, modern displays)
- **4:3**: Standard/classic (old TV format)
- **1:1**: Square (Instagram posts)
- **3:2**: Classic photography
- **21:9**: Ultrawide
- **9:16**: Vertical/Portrait (Instagram stories, mobile)

## Recommended Width Sets

### For full-width hero images:
```typescript
[375, 768, 1024, 1440, 1920, 2560]
```

### For content images:
```typescript
[320, 640, 960, 1280]
```

### For thumbnails:
```typescript
[150, 300, 450]
```

## Browser Support

This plugin works with all modern browsers that support:
- ES6+
- Clipboard API (for copy functionality)
- CSS Grid (for layout)

## Development

### Setup

```bash
git clone https://github.com/budmenind/sanity-image-UrlBuilder.git
cd sanity-image-UrlBuilder
npm install
```

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Lint

```bash
npm run lint
```

## Troubleshooting

### Images not loading

Ensure your Sanity project ID and dataset are correctly configured. Check the browser console for CORS errors.

### Copy button not working

The copy functionality requires a secure context (HTTPS) in most browsers. It works on localhost but requires HTTPS in production.

### Preview not showing

Make sure the image asset is published and accessible. Check if your project has the correct permissions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with:
- [@sanity/image-url](https://www.npmjs.com/package/@sanity/image-url) - Image URL builder
- [@sanity/ui](https://www.sanity.io/ui) - Sanity UI components
- [Sanity Studio v3](https://www.sanity.io/docs) - Content management

## Support

For issues and questions:
- [GitHub Issues](https://github.com/budmenind/sanity-image-UrlBuilder/issues)
- [Sanity Community](https://www.sanity.io/community)

## Related Resources

- [Sanity Image URL Documentation](https://www.sanity.io/docs/image-url)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Sanity Plugin Kit](https://github.com/sanity-io/plugin-kit)
