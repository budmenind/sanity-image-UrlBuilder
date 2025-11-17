# How the Plugin Works - Technical Overview

## Architecture Overview

This plugin is a **Sanity Studio V2 Tool** (not a document field type). It provides a standalone page accessible from the Studio navigation bar that allows users to browse their media library and generate responsive image URLs.

## Sanity V2 Parts System

### Tool Registration (sanity.json)

The plugin uses Sanity V2's parts system to register itself as a tool:

```json
{
  "paths": {
    "source": "./src",
    "compiled": "./lib"
  },
  "parts": [
    {
      "name": "part:image-url-generator/tool",
      "implements": "part:@sanity/base/tool",
      "path": "tool/ImageUrlGeneratorTool.tsx"
    },
    {
      "implements": "part:image-url-generator/tool",
      "path": "tool/index.ts"
    }
  ]
}
```

### Tool Configuration (src/tool/index.ts)

```typescript
import {ImageIcon} from '@sanity/icons'

export default {
  title: 'Image URL Generator',
  name: 'image-url-generator',
  icon: ImageIcon,
  component: () => import('./ImageUrlGeneratorTool'),
}
```

This configuration:
- Sets the tool title shown in navigation
- Defines the tool name (used internally)
- Specifies an icon (from @sanity/icons)
- Lazy-loads the main component

## Component Architecture

### ImageUrlGeneratorTool Component

The main tool component (`src/tool/ImageUrlGeneratorTool.tsx`) is a standalone page component with three main sections:

#### 1. Media Browser
```typescript
// Fetches images from Sanity using GROQ
const query = searchQuery
  ? `*[_type == "sanity.imageAsset" && (originalFilename match $search || title match $search)] | order(_createdAt desc) [0...50]`
  : `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...50]`

client.fetch<SanityImageAssetDocument[]>(query, {search: `*${searchQuery}*`})
```

Features:
- ✅ Real-time search by filename
- ✅ Grid layout with thumbnails
- ✅ Click to select images
- ✅ Visual feedback for selected image
- ✅ Loads 50 most recent images

#### 2. URL Configuration Panel
Reuses existing UI components:
- `AspectRatioSelector` - Choose aspect ratio (16:9, 4:3, custom, etc.)
- `SizeSelector` - Choose responsive widths (640, 1024, 1600, etc.)
- Format dropdown - auto, WebP, JPEG, PNG
- Quality slider - 1-100%
- Fit mode dropdown - clip, crop, fill, etc.

#### 3. Generated URLs Display
Uses the `UrlDisplay` component to show:
- Single URL with copy button
- Responsive HTML markup with srcset
- Markdown format
- JSON representation
- Live image preview

## Data Flow

```
User Opens Tool from Navigation
    ↓
ImageUrlGeneratorTool Component Renders
    ↓
useEffect Fetches Images from Sanity
    ↓
[GROQ Query] → *[_type == "sanity.imageAsset"]
    ↓
Images Displayed in Grid
    ↓
User Clicks Image → setSelectedAsset()
    ↓
Configuration Panel Appears
    ↓
User Adjusts Settings → setState()
    ↓
useMemo Triggers → Generate URLs
    ↓
buildImageUrl() + buildAllMarkup()
    ↓
Display URLs with Copy Buttons
```

## URL Generation

The tool uses the same utility functions as before:

### buildImageUrl()
```typescript
const url = buildImageUrl({
  projectId,      // From client.config()
  dataset,        // From client.config()
  asset,          // Selected asset from media browser
  width: 1600,    // User selection
  aspectRatio: '16:9',  // User selection
  fit: 'clip',    // User selection
  quality: 75,    // User selection
})
```

This generates a Sanity CDN URL like:
```
https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}-{width}x{height}.{ext}?w=1600&h=900&fit=clip&q=75
```

### buildAllMarkup()
Generates responsive markup in multiple formats:

**HTML:**
```html
<img
  src="https://cdn.sanity.io/images/.../image-1600x900.jpg?fit=clip&q=75"
  srcset="
    https://cdn.sanity.io/images/.../image-640x360.jpg?fit=clip&q=75 640w,
    https://cdn.sanity.io/images/.../image-1024x576.jpg?fit=clip&q=75 1024w,
    https://cdn.sanity.io/images/.../image-1600x900.jpg?fit=clip&q=75 1600w
  "
  sizes="100vw"
  alt="Description"
  loading="lazy"
/>
```

**Markdown:**
```markdown
![Description](https://cdn.sanity.io/images/.../image-1600x900.jpg?fit=clip&q=75)
```

**JSON:**
```json
{
  "url": "https://cdn.sanity.io/.../image-1600x900.jpg?fit=clip&q=75",
  "srcset": [
    {"url": "...", "width": 640},
    {"url": "...", "width": 1024},
    {"url": "...", "width": 1600}
  ],
  "alt": "Description"
}
```

## Integration with Sanity

### How Sanity Loads the Tool

1. **Plugin Installation**: User adds `"sanity-plugin-image-url-generator"` to `plugins` array in `sanity.json`

2. **Part Resolution**: Sanity reads the plugin's `sanity.json` and discovers:
   - Tool part implementing `part:@sanity/base/tool`
   - Tool configuration at `src/tool/index.ts`

3. **Navigation Registration**: Sanity adds "Image URL Generator" to the Studio navigation bar

4. **Lazy Loading**: When user clicks the tool, Sanity:
   - Calls the `component()` function from tool config
   - Dynamically imports `ImageUrlGeneratorTool.tsx`
   - Renders the component in the main content area

### Client Access

The tool uses Sanity's `useClient()` hook to access:
- Project ID (`client.config().projectId`)
- Dataset name (`client.config().dataset`)
- GROQ query API (`client.fetch()`)

This provides automatic authentication and configuration.

## Key Differences from Document Field Approach

| Aspect | Document Field (V3) | Standalone Tool (V2) |
|--------|---------------------|----------------------|
| Access | Inside document forms | From navigation bar |
| Scope | Single document's image | Any image in library |
| Registration | `definePlugin()` + schema | Parts in `sanity.json` |
| Component Type | Input component | Page component |
| Props | `ObjectInputProps` | None (uses hooks) |
| Data Source | Form value | GROQ queries |
| Use Case | Content editing | Quick URL generation |

## Component Reuse

The tool **reuses** existing components:
- ✅ `AspectRatioSelector` - Aspect ratio selection UI
- ✅ `SizeSelector` - Width selection checkboxes
- ✅ `UrlDisplay` - URL display with copy buttons
- ✅ `CopyButton` - Copy to clipboard functionality

The tool **adds new features**:
- ✅ Media library browser with search
- ✅ Image selection grid
- ✅ GROQ-based asset fetching
- ✅ Standalone page layout

## Utility Functions

All utility functions remain **unchanged** and fully functional:

**URL Builder:**
- `buildImageUrl()` - Single URL
- `buildImageUrls()` - Multiple URLs for srcset
- `getPreviewUrl()` - Preview URL (800px)

**Markup Builder:**
- `buildResponsiveHtml()` - HTML with srcset
- `buildMarkdown()` - Markdown syntax
- `buildJson()` - JSON representation
- `buildAllMarkup()` - All formats at once

**Aspect Ratio Calculator:**
- `parseAspectRatio()` - Parse "16:9" strings
- `calculateHeight()` - Calculate height from width + ratio
- `isValidAspectRatio()` - Validate ratio strings
- `COMMON_ASPECT_RATIOS` - Preset ratios
- `COMMON_WIDTHS` - Preset widths

These can be imported and used in any project:

```typescript
import {buildImageUrl, buildResponsiveHtml} from 'sanity-plugin-image-url-generator'
```

## Why This Architecture Works

1. **No Duplication**: Reuses existing UI components
2. **Flexible Access**: Available from anywhere in Studio
3. **Simple Integration**: Just add to plugins array
4. **V2 Compatible**: Uses proven parts system
5. **Full Features**: Complete media browsing + URL generation
6. **Type Safe**: Full TypeScript support
7. **Extensible**: Easy to add new features

## What Gets Saved

**Nothing!** This is a **tool**, not a document field. It doesn't modify or save any data. It:
- Reads from media library
- Generates URLs on-demand
- Copies URLs to clipboard
- No database writes

This makes it perfect for:
- Quick URL generation
- Testing image configurations
- Sharing image links
- Creating responsive markup
- Frontend development

## Frontend Usage

While the Studio tool generates URLs, you can also use the utilities in your frontend:

```typescript
// In your Next.js/React app
import {buildImageUrl} from 'sanity-plugin-image-url-generator'
import {client} from './sanity'

// Fetch document with image
const post = await client.fetch(`*[_type == "post"][0]{
  title,
  heroImage {
    asset->
  }
}`)

// Generate responsive URL
const imageUrl = buildImageUrl({
  projectId: 'abc123',
  dataset: 'production',
  asset: post.heroImage.asset,
  width: 1200,
  aspectRatio: '16:9',
  quality: 80,
})
```

## Conclusion

The plugin is **fully functional** as a Sanity V2 tool because it:
- ✅ Uses V2 parts system for registration
- ✅ Provides standalone page accessible from navigation
- ✅ Fetches real images from media library via GROQ
- ✅ Generates production-ready CDN URLs
- ✅ Supports all Sanity image transformations
- ✅ Provides copy-paste functionality
- ✅ Includes live preview
- ✅ Works independently of documents

**It's not a mockup - it's a working V2 tool!**
