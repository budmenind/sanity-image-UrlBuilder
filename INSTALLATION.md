# Installation Guide

## Sanity Studio V2 - Standalone Tool

This plugin provides a **standalone tool** accessible from your Studio's navigation bar. It allows you to browse your media library and generate responsive image URLs without being tied to document fields.

### Method 1: Local Installation (For Testing)

#### Step 1: Build the Plugin

In the plugin directory:

```bash
cd /home/user/sanity-image-UrlBuilder
npm install
npm run build
```

#### Step 2: Link the Plugin

Still in the plugin directory:

```bash
npm link
```

This creates a global symlink to this plugin.

#### Step 3: Navigate to Your Sanity Studio

```bash
cd /path/to/your/sanity-studio
```

#### Step 4: Link the Plugin to Your Studio

```bash
npm link sanity-plugin-image-url-generator
```

#### Step 5: Add the Plugin to Your Studio

For Sanity V2, add the plugin to your `sanity.json`:

```json
{
  "root": true,
  "project": {
    "name": "Your Project Name"
  },
  "plugins": [
    "@sanity/base",
    "@sanity/components",
    "@sanity/default-layout",
    "@sanity/default-login",
    "@sanity/desk-tool",
    "sanity-plugin-image-url-generator"
  ]
}
```

#### Step 6: Start Your Studio

```bash
npm run dev
# or
sanity start
```

#### Step 7: Access the Tool

1. Open your Studio in the browser (usually `http://localhost:3333`)
2. Look for **"Image URL Generator"** in the top navigation bar
3. Click it to open the tool
4. You should see:
   - Search box to filter images
   - Grid of images from your media library
   - Click any image to select it
   - Configuration panel appears with aspect ratio, size, quality, format options
   - Generated URLs section with copy buttons
   - Live preview of the image

---

## Method 2: Install from npm (After Publishing)

Once published to npm, installation is simpler:

### Step 1: Install the Package

```bash
cd /path/to/your/sanity-studio
npm install sanity-plugin-image-url-generator
```

### Step 2: Add to sanity.json

Add `"sanity-plugin-image-url-generator"` to your `plugins` array in `sanity.json`:

```json
{
  "plugins": [
    "@sanity/base",
    "@sanity/default-layout",
    "@sanity/desk-tool",
    "sanity-plugin-image-url-generator"
  ]
}
```

### Step 3: Restart Studio

```bash
npm run dev
```

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

### Plugin Not Showing in Navigation

1. Check that `"sanity-plugin-image-url-generator"` is in your `plugins` array in `sanity.json`
2. Make sure you restarted the Studio after adding the plugin
3. Clear your browser cache and reload
4. Check the browser console for errors

### "Tool not found" Error

1. Make sure the plugin is properly installed and linked
2. Verify `sanity.json` in the plugin directory has the correct tool parts configured
3. Try deleting `node_modules` in your Studio and running `npm install` again

### No Images Showing in Media Browser

1. Make sure you have images uploaded to your Sanity project
2. Check that your project ID and dataset are correctly configured
3. Verify you have read permissions for the dataset
4. Check the browser console for GROQ query errors

### TypeScript Errors

If you see TypeScript errors:

1. Make sure the plugin is built: `npm run build` in the plugin directory
2. Restart your TypeScript server in your IDE
3. Restart the Studio dev server

---

## Verifying Installation

To verify the plugin is working:

1. **Check Plugin Loaded**: Open browser console, you should see no errors
2. **Check Navigation**: Look for "Image URL Generator" in the top navigation
3. **Click the Tool**: The tool should open showing the media browser
4. **Test Search**: Try searching for an image by filename
5. **Test Selection**: Click an image - configuration panel should appear
6. **Test URL Generation**:
   - Select different aspect ratios
   - Choose different widths
   - Adjust quality slider
   - URLs should update in real-time
7. **Test Copy Buttons**: Click copy buttons to verify URLs are copied to clipboard
8. **Test Preview**: Preview image should display at the bottom

---

## What You'll See

When you open the tool from the navigation bar:

```
┌─────────────────────────────────────────────────┐
│  Image URL Generator                            │
│  Select an image from your media library        │
│  and generate responsive URLs                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Media Library              [Clear Selection]   │
│                                                  │
│  [Search images by filename...]                 │
│                                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │              │
│  │ 1   │ │ 2   │ │ 3   │ │ 4   │              │
│  └─────┘ └─────┘ └─────┘ └─────┘              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │              │
│  │ 5   │ │ 6   │ │ 7   │ │ 8   │              │
│  └─────┘ └─────┘ └─────┘ └─────┘              │
└─────────────────────────────────────────────────┘

After selecting an image:

┌─────────────────────────────────────────────────┐
│  Image URL Configuration                        │
│                                                  │
│  Aspect Ratio: [16:9 ▼]    Format: [auto ▼]   │
│                             Quality: 75% ━━◉━   │
│                                                  │
│  Widths:                    Fit Mode: [clip ▼] │
│  ☑640 ☑1024 ☑1600                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Generated URLs                                 │
│                                                  │
│  Single URL:                                    │
│  https://cdn.sanity.io/...                      │
│  [Copy URL] [Preview]                           │
│                                                  │
│  Responsive Markup:                             │
│  [HTML] [Markdown] [JSON]                       │
│  <img src="..." srcset="..." />                 │
│  [Copy HTML]                                    │
│                                                  │
│  Live Preview:                                  │
│  [Image preview shown here]                     │
└─────────────────────────────────────────────────┘
```

---

## Using the Utility Functions in Your Frontend

The plugin also exports utility functions that you can use in your frontend application:

```typescript
import {
  buildImageUrl,
  buildImageUrls,
  buildResponsiveHtml,
  buildMarkdown,
  buildJson,
  COMMON_ASPECT_RATIOS,
  COMMON_WIDTHS,
} from 'sanity-plugin-image-url-generator'

// Build a single URL
const url = buildImageUrl({
  projectId: 'your-project',
  dataset: 'production',
  asset: imageAsset, // SanityImageAssetDocument
  width: 1200,
  aspectRatio: '16:9',
  fit: 'clip',
  quality: 80,
})

// Build multiple URLs for srcset
const urls = buildImageUrls({
  projectId: 'your-project',
  dataset: 'production',
  asset: imageAsset,
  widths: [640, 1024, 1600],
  aspectRatio: '16:9',
  fit: 'clip',
  quality: 80,
})

// Generate HTML markup
const html = buildResponsiveHtml({
  projectId: 'your-project',
  dataset: 'production',
  asset: imageAsset,
  widths: [640, 1024, 1600],
  aspectRatio: '16:9',
  alt: 'Description',
})
```

---

## Uninstalling (if needed)

To remove the plugin:

```bash
# In your Studio
npm unlink sanity-plugin-image-url-generator

# Remove from sanity.json plugins array
# Restart Studio
```

---

## Next Steps

Once installed and working:

1. Browse your media library
2. Test image selection
3. Try different aspect ratios
4. Test with various widths
5. Adjust quality settings
6. Try different formats (WebP, JPEG, PNG)
7. Test copy buttons
8. Verify URLs work in your frontend
9. Check preview images display correctly

---

## Sanity Studio V3 Support

While this plugin is primarily designed for V2 as a standalone tool, it also works with V3. The utility functions are fully compatible with V3, and you can use them in your V3 projects for URL generation.
