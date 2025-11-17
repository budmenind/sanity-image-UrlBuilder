# Installation Guide

## Method 1: Local Installation (For Testing)

### Step 1: Build the Plugin

In the plugin directory (`sanity-image-UrlBuilder`):

```bash
cd /home/user/sanity-image-UrlBuilder
npm install
npm run build
```

### Step 2: Link the Plugin

Still in the plugin directory:

```bash
npm link
```

This creates a global symlink to this plugin.

### Step 3: Navigate to Your Sanity Studio

```bash
cd /path/to/your/sanity-studio
```

### Step 4: Link the Plugin to Your Studio

```bash
npm link sanity-plugin-image-url-generator
```

### Step 5: Add the Plugin to Your Sanity Config

Edit `sanity.config.ts` (or `sanity.config.js`):

```typescript
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'

export default defineConfig({
  name: 'default',
  title: 'My Sanity Project',

  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    deskTool(),
    imageUrlGenerator({
      // Optional: Configure defaults
      defaultAspectRatio: '16:9',
      defaultWidths: [640, 1024, 1600],
      defaultQuality: 75,
    })
  ],

  schema: {
    types: [
      // Your schema types will be here
    ],
  },
})
```

### Step 6: Use the Plugin in Your Schema

Create or edit a schema file (e.g., `schemas/blogPost.ts`):

```typescript
import {defineType, defineField} from 'sanity'

export default defineType({
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
      type: 'imageUrlGenerator', // ← Use the custom type
      title: 'Hero Image',
      description: 'Upload an image and generate responsive URLs',
      options: {
        // Optional: Override plugin defaults for this field
        defaultAspectRatio: '16:9',
        defaultWidths: [640, 1024, 1600, 2400],
      }
    }),
    defineField({
      name: 'content',
      type: 'text',
      title: 'Content',
    }),
  ],
})
```

### Step 7: Register Your Schema

Make sure your schema is registered in `sanity.config.ts`:

```typescript
import blogPost from './schemas/blogPost'

export default defineConfig({
  // ... other config
  schema: {
    types: [blogPost],
  },
})
```

### Step 8: Start Your Studio

```bash
npm run dev
```

### Step 9: Test the Plugin

1. Open your Studio in the browser (usually `http://localhost:3333`)
2. Create a new Blog Post document
3. You should see the Hero Image field with:
   - Standard Sanity image upload/selection UI
   - Hotspot and crop tools
   - Below that: URL generation controls (aspect ratio, widths, quality, etc.)
   - Generated URLs with copy buttons

---

## Method 2: Install from npm (After Publishing)

Once published to npm, installation is simpler:

### Step 1: Install the Package

```bash
cd /path/to/your/sanity-studio
npm install sanity-plugin-image-url-generator
```

### Step 2: Add to Config

Same as Method 1, Step 5 above.

### Step 3: Use in Schema

Same as Method 1, Step 6 above.

---

## Troubleshooting

### "Module not found" Error

If you see `Cannot find module 'sanity-plugin-image-url-generator'`:

1. Make sure you ran `npm link` in the plugin directory
2. Make sure you ran `npm link sanity-plugin-image-url-generator` in your Studio
3. Try unlinking and relinking:
   ```bash
   # In your Studio
   npm unlink sanity-plugin-image-url-generator

   # In the plugin directory
   npm unlink
   npm link

   # Back in your Studio
   npm link sanity-plugin-image-url-generator
   ```

### Type Errors

If you see TypeScript errors:

1. Make sure the plugin is built: `npm run build` in the plugin directory
2. Restart your TypeScript server in your IDE
3. Restart the Studio dev server

### Plugin Not Showing Up

1. Check that `imageUrlGenerator()` is in your `plugins` array in `sanity.config.ts`
2. Make sure you're using type `'imageUrlGenerator'` in your schema
3. Clear your browser cache and reload
4. Check the browser console for errors

### URLs Not Generating

1. Make sure an image is selected/uploaded
2. Check browser console for errors
3. Verify your Sanity project ID and dataset are correct

---

## Example: Complete Setup

Here's a complete working example:

### sanity.config.ts
```typescript
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'My Blog',
  projectId: 'abc123',
  dataset: 'production',

  plugins: [
    deskTool(),
    imageUrlGenerator({
      defaultAspectRatio: '16:9',
      defaultWidths: [640, 1024, 1600],
      defaultQuality: 80,
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
```

### schemas/index.ts
```typescript
import blogPost from './blogPost'
import page from './page'

export const schemaTypes = [blogPost, page]
```

### schemas/blogPost.ts
```typescript
import {defineType, defineField} from 'sanity'

export default defineType({
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
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'heroImage',
      type: 'imageUrlGenerator',
      title: 'Hero Image',
    }),
    defineField({
      name: 'thumbnail',
      type: 'imageUrlGenerator',
      title: 'Thumbnail',
      options: {
        defaultAspectRatio: '1:1',
        defaultWidths: [150, 300, 600],
      }
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [{type: 'block'}],
    }),
  ],
})
```

---

## Verifying Installation

To verify the plugin is working:

1. **Check Plugin Loaded**: Open browser console, you should see no errors
2. **Check Schema**: The field should appear in your document
3. **Test Upload**: Try uploading an image - the standard Sanity upload should work
4. **Test Hotspot**: Click "Edit hotspot" - Sanity's hotspot editor should appear
5. **Test Crop**: Click "Edit crop" - Sanity's crop tool should appear
6. **Check URL Generation**: After selecting an image, you should see:
   - Aspect ratio selector
   - Width checkboxes
   - Quality slider
   - Format dropdown
   - Generated URLs section with copy buttons

---

## Next Steps

Once installed and working:

1. Test all features thoroughly
2. Try different aspect ratios
3. Test with various image formats (JPG, PNG, WebP)
4. Test hotspot and crop changes
5. Verify URLs are correct
6. Test copy buttons
7. Check preview image displays

---

## Uninstalling (if needed)

To remove the plugin:

```bash
# In your Studio
npm unlink sanity-plugin-image-url-generator

# Remove from sanity.config.ts
# Remove 'imageUrlGenerator' type from schemas
# Change fields to regular 'image' type
```
