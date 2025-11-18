# sanity-plugin-image-url-generator

> Generate responsive image URLs from Sanity's media library without leaving the Studio—because story editors shouldn't need to understand CDN query parameters to get the right image on the page

## What This Solves

How do you give content editors the power of Sanity's image CDN without making them learn URL construction? Every time someone needs a responsive image, they're either copying URLs from the media library (losing control over dimensions and format) or asking a developer to generate the markup. That bottleneck kills editorial velocity.

This plugin puts Sanity's full image transformation capabilities—hotspot cropping, aspect ratios, responsive srcsets, format optimization—directly in the Studio as a standalone tool. Browse your media, click to set the focal point, configure your output, copy the code.

## Why It Exists

We started by building this as a custom document field type—the way most Sanity plugins work. You'd add `type: 'imageUrlGenerator'` to your schema and get URL generation controls below the image upload.

That approach failed immediately in practice.

Story editors don't think in terms of "which document field has my image." They think: "I need a URL for that hero image we uploaded last week." Tying URL generation to document fields meant editors had to navigate to the right document, find the right field, just to generate a URL for an image that already existed in the media library.

After rebuilding the architecture twice, we realized the tool needed to be **standalone**—accessible from the Studio navigation bar, not buried in document forms. Select any image from your entire media library, configure it, copy the code. No document context required.

The other discovery: Sanity V2's tooling ecosystem assumes you're using `@sanity/ui` components, but those V3 packages don't compile in V2's Webpack. We had to rebuild all UI from scratch using plain HTML and inline styles. The result is actually more portable and lighter-weight than the component library approach would have been.

## What It Does

Access the tool from your Studio's navigation bar and browse your entire media library:

```
Media Library
├── Search by filename
├── Grid view with thumbnails
└── Click to select any image
```

Once selected, set the focal point by clicking directly on the image. This generates hotspot data that ensures crops center on what matters—a face, a product, the action—regardless of aspect ratio:

```javascript
// Hotspot data generated from your click
{
  _type: 'sanity.imageHotspot',
  x: 0.35,  // 35% from left
  y: 0.25,  // 25% from top
  width: 0.3,
  height: 0.3
}
```

Configure your output with full control over Sanity's CDN parameters:

- **Aspect Ratios**: 16:9, 4:3, 1:1, 21:9, 9:16, 3:2, 2:3
- **Responsive Widths**: Select multiple breakpoints (320, 640, 768, 1024, 1366, 1600, 1920, 2400)
- **Formats**: Auto (recommended), WebP, JPEG, PNG
- **Quality**: 1-100% with live preview
- **Fit Modes**: Clip, Crop, Fill, Fillmax, Max, Scale, Min

The tool generates production-ready code in three formats:

**Responsive HTML** with srcset:
```html
<img
  src="https://cdn.sanity.io/images/abc123/production/image-1024x576.jpg?fit=crop&q=80"
  srcset="
    https://cdn.sanity.io/images/abc123/production/image-640x360.jpg?fit=crop&q=80 640w,
    https://cdn.sanity.io/images/abc123/production/image-1024x576.jpg?fit=crop&q=80 1024w,
    https://cdn.sanity.io/images/abc123/production/image-1600x900.jpg?fit=crop&q=80 1600w
  "
  sizes="100vw"
  alt="Hero image"
  loading="lazy"
/>
```

**Markdown** for documentation:
```markdown
![Hero image](https://cdn.sanity.io/images/abc123/production/image-1600x900.jpg?fit=crop&q=80)
```

**JSON** for programmatic use:
```json
{
  "url": "https://cdn.sanity.io/images/abc123/production/image-1600x900.jpg?fit=crop&q=80",
  "srcset": [
    {"url": "...", "width": 640},
    {"url": "...", "width": 1024},
    {"url": "...", "width": 1600}
  ],
  "alt": "Hero image"
}
```

Each format has a copy button. The live preview shows exactly what your configured image looks like.

## Getting Started

### Quick Start

Install and add to your Sanity V2 Studio:

```bash
npm install sanity-plugin-image-url-generator
```

Add to your `sanity.json` plugins array:

```json
{
  "plugins": [
    "@sanity/base",
    "@sanity/default-layout",
    "@sanity/desk-tool",
    "image-url-generator"
  ]
}
```

Start your Studio:

```bash
sanity start
```

Look for **"Image URL Generator"** in the top navigation bar. Click it, select an image, and you're generating URLs.

### Installation Details

**Requirements**:
- Sanity Studio V2 (uses the parts system, not V3's plugin architecture)
- Node 14+ (though 20+ recommended for development)
- React 16.8+ (hooks support required)

**Why V2?** This plugin uses Sanity's V2 parts system (`part:@sanity/base/tool`) to register as a standalone tool. V3 plugins use a different registration mechanism. If you're on V3, the utility functions are still usable but the Studio tool won't load.

### First Use

1. Open your Studio and click **"Image URL Generator"** in the navigation
2. You'll see a grid of your 50 most recent images
3. Use the search box to filter by filename
4. Click any image to select it
5. Click on the image in the "Hotspot & Crop" section to set the focal point (you'll see a blue dot and crosshairs appear)
6. Configure aspect ratio, widths, quality, format, and fit mode
7. Copy the generated URL, HTML, Markdown, or JSON

The live preview at the bottom shows your image with current settings applied.

## How It Works

### Architecture

The plugin registers as a Sanity V2 tool via the parts system:

```
sanity.json
└── implements: part:@sanity/base/tool
    └── tool/index.ts (tool configuration)
        └── ImageUrlGeneratorTool.tsx (main component)
```

When you click the tool in navigation, Sanity renders `ImageUrlGeneratorTool` as a full-page component. This component:

1. **Fetches assets** via GROQ query to `sanity.imageAsset` documents
2. **Manages state** for selected asset, hotspot position, and configuration
3. **Generates URLs** using `@sanity/image-url` builder with your parameters
4. **Renders UI** using plain HTML with inline styles (no external UI library)

### Why Plain HTML Instead of @sanity/ui?

Sanity's `@sanity/ui` package uses modern JavaScript syntax (optional catch binding, nullish coalescing) that V2's Webpack configuration can't parse. We tried:

- Updating Babel configuration (breaks other parts of Studio)
- Transpiling the package ourselves (dependency hell)
- Using older @sanity/ui versions (API incompatibility)

The solution: write all UI from scratch. This actually improved the plugin—no external dependencies means it loads faster and won't break when Sanity updates their UI library.

### URL Generation

URLs are built using `@sanity/image-url` with your configuration:

```javascript
const url = imageUrlBuilder({projectId, dataset})
  .image({
    _type: 'image',
    asset: {_ref: assetId, _type: 'reference'},
    hotspot: {x: 0.35, y: 0.25, width: 0.3, height: 0.3}
  })
  .width(1600)
  .height(900)  // Calculated from aspect ratio
  .fit('crop')
  .quality(80)
  .auto('format')  // When format is 'auto'
  .url()
```

The hotspot data tells Sanity's CDN where to center the crop. Without it, crops center on the image midpoint—which often cuts off heads or misses the subject entirely.

### State Management

We use React hooks with careful memoization to prevent infinite render loops:

```javascript
// Client must be memoized—withConfig() returns new instance each call
const client = useMemo(() =>
  sanityClient.withConfig({apiVersion: '2023-01-01'}),
[])

// Generated content recalculates when inputs change
const generatedContent = useMemo(() => {
  // ... URL building logic
}, [selectedAsset, aspectRatio, widths, quality, format, fit, hotspot, crop])
```

The initial version caused the Studio to hang because the client was recreated on each render, triggering infinite useEffect cycles.

## Known Limitations & Open Questions

### Current Boundaries

**Sanity V2 Only**: The Studio tool uses the V2 parts system. V3 Studios can't load it as a tool, though the exported utility functions (`buildImageUrl`, `buildResponsiveHtml`, etc.) work in any JavaScript environment.

**50 Image Limit**: The media browser loads your 50 most recent images. For larger libraries, use search to find specific images. Pagination would improve this but adds complexity we haven't prioritized.

**No Crop Rectangle**: You can set the hotspot (focal point), but not a crop rectangle. Sanity's image input component has a crop UI we haven't replicated. For now, use the Studio's built-in image field to set crops, then use this tool to generate URLs.

**Single Image at a Time**: You can't batch-generate URLs for multiple images. Each selection starts fresh. Batch operations would be valuable for large content migrations.

### Edge Cases

**Very Large Images**: Images over 4000px wide can slow the hotspot picker because we load them at 800px for the preview. The generated URLs work fine at any size.

**SVG Images**: Sanity stores SVGs as assets but they don't support the same transformations (no width/height cropping). The tool will generate URLs but parameters are ignored.

**CORS Issues**: If your Studio runs on a different domain than your CDN configuration allows, preview images may not load. The generated URLs will still work in production.

### Open Questions

**Should this support video posters?** Sanity has video assets—generating poster frames at specific timestamps would be useful but requires different CDN parameters.

**What about art direction?** Different crops for different breakpoints (not just sizes) is a real editorial need. This requires multiple hotspots per image, which complicates the UI significantly.

**Integration with asset metadata?** Images in Sanity can have alt text, titles, and custom metadata. Currently we use the filename as fallback alt text. Deeper integration with asset fields would improve accessibility.

## Contributing

### What Would Extend This

**V3 Support**: Rewriting the tool registration for Sanity V3's plugin architecture would make this useful to the majority of new Sanity projects. The core logic is version-agnostic—it's the registration and client access that differs.

**Crop Rectangle UI**: Replicating Sanity's crop interface would give editors full control. This is substantial UI work but well-understood territory.

**Batch Operations**: Select multiple images, apply the same configuration, generate a ZIP or JSON array. Useful for migrations and bulk content updates.

**Preview in Context**: Show how the image looks at each breakpoint, not just the middle size. Maybe a responsive preview that simulates different viewport widths.

### Technical Contributions

Fork the repository and create a feature branch:

```bash
git checkout -b feature/your-discovery
```

Run tests and build before submitting:

```bash
npm run build        # Compile TypeScript and generate types
npm run build:v2     # Create lib directory for V2 runtime
```

Pull requests should explain what problem you encountered and what you learned solving it—not just what code changed. We're interested in the discovery, not just the diff.

### Reporting Issues

Useful issue reports include:

- What you were trying to accomplish
- Your Sanity Studio version (V2 or V3)
- Browser and OS
- Console errors (full stack trace)
- Steps to reproduce

"URLs don't generate" isn't actionable. "URLs generate without hotspot data when using Safari 16 on images wider than 2000px" leads to a fix.

## What We Learned

The biggest discovery: **document fields are the wrong abstraction for utility tools**. We spent weeks building a sophisticated field-based UI before realizing editors don't work that way. They want to grab any image from anywhere and generate code—the document is irrelevant.

We also learned that V2 compatibility is harder than it looks. The ecosystem assumes everyone moved to V3, so documentation for V2 patterns is sparse. We had to read Sanity's source code to understand how tools register. The irony: V2's parts system is actually simpler than V3's plugin architecture once you understand it.

Building UI without a component library felt like regression at first. It turned out to be liberating—no dependency updates to track, no breaking changes from upstream, no fighting the abstraction when you need something custom. Plain HTML with inline styles is unfashionable but extremely portable.

What's now possible: story editors can generate production-ready responsive images without developer involvement. That unblocks editorial velocity in a way that documentation and training never could. The tool is the documentation.

New question: if standalone tools work better than document fields for utilities, what other Sanity functionality is misplaced in the content schema? Color pickers, icon selectors, embed code generators—all of these might benefit from the same "tool, not field" approach.

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Links

- **Issues**: [Report bugs or request features](https://github.com/budmenind/sanity-image-UrlBuilder/issues)
- **Sanity Documentation**: [Image URLs](https://www.sanity.io/docs/image-urls)
- **@sanity/image-url**: [NPM package](https://www.npmjs.com/package/@sanity/image-url)
