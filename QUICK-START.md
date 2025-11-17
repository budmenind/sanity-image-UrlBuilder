# Quick Start Guide

## 5-Minute Setup

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

### 3. Add to Config
```typescript
// sanity.config.ts
import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'

export default defineConfig({
  // ... other config
  plugins: [
    imageUrlGenerator()
  ]
})
```

### 4. Use in Schema
```typescript
// schemas/blogPost.ts
{
  name: 'heroImage',
  type: 'imageUrlGenerator',
  title: 'Hero Image'
}
```

### 5. Start Studio
```bash
npm run dev
```

### 6. Test It!
1. Open `http://localhost:3333`
2. Create a document with your image field
3. Upload an image
4. See URL generation controls appear below
5. Copy your generated URLs!

---

## What You'll See

```
┌─────────────────────────────────────┐
│  📁 Upload or Select Image          │
│  [Drag & drop or browse]            │
│  ✓ Image selected                   │
│  [Edit Hotspot] [Edit Crop]         │
└─────────────────────────────────────┘

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

**Plugin not showing**
→ Check `plugins` array in `sanity.config.ts` includes `imageUrlGenerator()`

**Field not appearing**
→ Make sure field type is `'imageUrlGenerator'` (not `'image'`)

**No URL controls**
→ Upload/select an image first - controls appear after image is selected

---

## Full Documentation

- [INSTALLATION.md](./INSTALLATION.md) - Detailed setup guide
- [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) - Technical architecture
- [README.md](./README.md) - Complete feature list
- [examples/usage.ts](./examples/usage.ts) - Code examples
