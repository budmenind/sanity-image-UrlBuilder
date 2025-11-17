# How the Plugin Works - Technical Overview

## Component Architecture

### ImageUrlGenerator Component

The `ImageUrlGenerator` component uses Sanity's **`renderDefault()`** function to render the built-in image input, which provides:

- ✅ **Image upload** from local files
- ✅ **Image selection** from Sanity's media library
- ✅ **Hotspot editing** using Sanity's interactive UI
- ✅ **Crop editing** using Sanity's crop tool
- ✅ **Alt text field** for accessibility

```typescript
export function ImageUrlGenerator(props: ImageUrlGeneratorProps) {
  const {value, renderDefault, schemaType} = props

  return (
    <Stack space={4}>
      {/* This renders Sanity's full-featured image input */}
      {renderDefault(props)}

      {/* Our custom URL generation UI appears below */}
      {asset && (
        <Card>
          <AspectRatioSelector ... />
          <SizeSelector ... />
          <UrlDisplay ... />
        </Card>
      )}
    </Stack>
  )
}
```

### How It Integrates with Sanity

1. **Plugin Registration**: The plugin defines a custom schema type `imageUrlGenerator` that extends Sanity's base `image` type

2. **Custom Input Component**: When users add a field with type `imageUrlGenerator`, Sanity renders our `ImageUrlGenerator` component

3. **Delegation to Default**: Our component calls `renderDefault(props)` which renders Sanity's standard image input with all native features

4. **Enhanced UI**: Below the standard input, we add our custom controls for aspect ratio, size selection, and URL generation

5. **Real-time Updates**: When users upload/select an image or edit hotspot/crop, the component re-renders and generates new URLs

## Data Flow

```
User Action (upload/crop/hotspot)
    ↓
Sanity's Default Image Input (renderDefault)
    ↓
Form State Updates (value.asset, value.crop, value.hotspot)
    ↓
useEffect Hook Fetches Asset Details
    ↓
URL Generation (buildImageUrl, buildAllMarkup)
    ↓
Display URLs with Copy Buttons
```

## Key Implementation Details

### 1. Using renderDefault()

```typescript
// ✅ CORRECT: Delegates to Sanity's image input
{renderDefault(props)}

// ❌ WRONG: Tries to recreate the image input
<input type="file" ... />
```

### 2. Reading Options from Schema

```typescript
// Options are passed through schema, not props
const options = (schemaType.options as PluginOptions) || {}
```

### 3. Fetching Asset Details

```typescript
useEffect(() => {
  if (imageAssetId) {
    client
      .fetch<SanityImageAssetDocument>(`*[_id == $id][0]`, {id: imageAssetId})
      .then(setAsset)
  }
}, [imageAssetId, client])
```

### 4. Generating URLs from Asset

```typescript
const url = buildImageUrl({
  projectId,      // From client config
  dataset,        // From client config
  asset,          // Fetched asset document
  width: 1600,    // User selection
  aspectRatio: '16:9',  // User selection
  fit: 'clip',    // User selection
  quality: 75,    // User selection
  crop,           // From form value
  hotspot,        // From form value
})
```

## Schema Usage Example

```typescript
import {defineType, defineField} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      type: 'imageUrlGenerator',  // Uses our custom type
      title: 'Hero Image',
      options: {
        // Plugin options
        defaultAspectRatio: '16:9',
        defaultWidths: [640, 1024, 1600],
        defaultQuality: 75,
      }
    })
  ]
})
```

## Why This Approach Works

1. **No Duplication**: We don't rebuild Sanity's image input - we use it directly
2. **Full Features**: Users get ALL Sanity image features (upload, hotspot, crop, etc.)
3. **Enhanced Functionality**: We add URL generation on top of standard features
4. **Proper Integration**: Works seamlessly with Sanity's form system
5. **Type Safety**: Full TypeScript support throughout

## What Gets Saved

When a user fills in an `imageUrlGenerator` field, Sanity saves:

```json
{
  "heroImage": {
    "_type": "image",
    "asset": {
      "_ref": "image-abc123...",
      "_type": "reference"
    },
    "crop": {
      "_type": "sanity.imageCrop",
      "top": 0,
      "bottom": 0,
      "left": 0,
      "right": 0
    },
    "hotspot": {
      "_type": "sanity.imageHotspot",
      "x": 0.5,
      "y": 0.5,
      "width": 1,
      "height": 1
    },
    "alt": "Description of the image"
  }
}
```

The URL generation happens in the Studio UI - it doesn't modify the saved data.

## Frontend Usage

In your frontend, you can use the utility functions directly:

```typescript
import {buildImageUrl} from 'sanity-plugin-image-url-generator'

// In your component
const imageUrl = buildImageUrl({
  projectId: 'your-project',
  dataset: 'production',
  asset: blogPost.heroImage.asset,
  width: 1200,
  aspectRatio: '16:9',
  fit: 'clip',
  quality: 80,
  crop: blogPost.heroImage.crop,
  hotspot: blogPost.heroImage.hotspot,
})
```

## Conclusion

The plugin is **fully functional** because it:
- ✅ Uses Sanity's real image input via `renderDefault()`
- ✅ Preserves all standard image features
- ✅ Adds URL generation UI
- ✅ Generates production-ready URLs
- ✅ Integrates seamlessly with Sanity's form system

**It's not a mockup - it's a working plugin!**
