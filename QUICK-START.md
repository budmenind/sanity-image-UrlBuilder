# Quick Start Guide

## 5-Minute Setup (Sanity V2)

### 1. Build & Link (in plugin directory)
```bash
cd /home/user/sanity-image-UrlBuilder
npm install
npm run build
npm link
```

### 2. Link to Your Studio
```bash
cd /path/to/your/sanity-studio
npm link sanity-plugin-image-url-generator
```

### 3. Add to sanity.json
```json
{
  "root": true,
  "plugins": [
    "@sanity/base",
    "@sanity/default-layout",
    "@sanity/desk-tool",
    "sanity-plugin-image-url-generator"
  ]
}
```

### 4. Start Studio
```bash
npm run dev
```

### 5. Access the Tool
1. Open `http://localhost:3333`
2. Look for **"Image URL Generator"** in the top navigation
3. Click to open the tool

### 6. Test It!
1. Search for images in the media browser
2. Click an image to select it
3. See configuration panel appear
4. Adjust aspect ratio, widths, quality, format
5. Copy your generated URLs!

---

## What You'll See

```
┌─────────────────────────────────────┐
│  Image URL Generator                │
│  Select an image from your media    │
│  library and generate URLs          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Media Library    [Clear Selection] │
│                                      │
│  [🔍 Search images...]              │
│                                      │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │IMG│ │IMG│ │IMG│ │IMG│          │
│  └───┘ └───┘ └───┘ └───┘          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │IMG│ │IMG│ │IMG│ │IMG│          │
│  └───┘ └───┘ └───┘ └───┘          │
└─────────────────────────────────────┘

Click an image to see:

┌─────────────────────────────────────┐
│  ⚙️ Image URL Configuration         │
│                                      │
│  Aspect Ratio: [16:9 ▼]            │
│  Widths: ☑640 ☑1024 ☑1600          │
│  Format: [auto ▼]  Quality: [75]   │
│  Fit Mode: [clip ▼]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📋 Generated URLs                  │
│                                      │
│  Single URL:                        │
│  https://cdn.sanity.io/...          │
│  [Copy URL] [Preview]               │
│                                      │
│  Responsive Markup:                 │
│  [HTML] [Markdown] [JSON]           │
│  <img src="..." srcset="..." />     │
│  [Copy HTML]                        │
│                                      │
│  Live Preview:                      │
│  [Image preview shown here]         │
└─────────────────────────────────────┘
```

---

## Common Issues

**"Cannot find module"**
→ Run `npm link` in plugin dir, then `npm link sanity-plugin-image-url-generator` in Studio

**Plugin not showing in navigation**
→ Check `plugins` array in `sanity.json` includes `"sanity-plugin-image-url-generator"`

**No images appearing**
→ Make sure you have images uploaded to your Sanity project

**Tool not opening**
→ Clear browser cache, restart Studio dev server, check console for errors

---

## Key Features

✨ **Standalone Tool** - Access from Studio navigation, not tied to documents
🔍 **Media Browser** - Browse and search your existing media library
📐 **Aspect Ratios** - 16:9, 4:3, 1:1, 21:9, and custom ratios
📏 **Responsive Widths** - Multiple sizes for srcset (640, 1024, 1600, etc.)
🎨 **Formats** - Auto, WebP, JPEG, PNG
⚙️ **Quality Control** - Adjust compression (1-100%)
🔧 **Fit Modes** - Clip, Crop, Fill, Scale, and more
📋 **Copy Buttons** - One-click copy for URLs and markup
🖼️ **Live Preview** - See your image with current settings
📱 **HTML/Markdown/JSON** - Export in multiple formats

---

## Using Utility Functions

You can also use the plugin's utility functions directly in your code:

```typescript
import {buildImageUrl, buildResponsiveHtml} from 'sanity-plugin-image-url-generator'

// Generate a single URL
const url = buildImageUrl({
  projectId: 'abc123',
  dataset: 'production',
  asset: imageAsset,
  width: 1200,
  aspectRatio: '16:9',
  quality: 80,
})

// Generate responsive HTML
const html = buildResponsiveHtml({
  projectId: 'abc123',
  dataset: 'production',
  asset: imageAsset,
  widths: [640, 1024, 1600],
  aspectRatio: '16:9',
  alt: 'Hero image',
})
```

---

## Full Documentation

- [INSTALLATION.md](./INSTALLATION.md) - Detailed setup guide
- [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) - Technical architecture
- [README.md](./README.md) - Complete feature list
- [TEST-RESULTS.md](./TEST-RESULTS.md) - Build verification

---

## Differences from Original Design

This plugin is now a **standalone tool** instead of a document field type:

**What changed:**
- ✅ Accessible from Studio navigation bar (not a field)
- ✅ Browse entire media library (not limited to a document)
- ✅ Works with Sanity V2 (using parts system)
- ✅ No schema changes needed
- ✅ All utility functions still work the same

**Why it's better:**
- Quick access from anywhere in Studio
- Not tied to specific documents or content types
- Can generate URLs for any image on-demand
- Simpler installation (just add to plugins array)
- More flexible workflow
