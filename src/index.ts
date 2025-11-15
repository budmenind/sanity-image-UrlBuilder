import {definePlugin} from 'sanity'
import {ImageUrlGenerator} from './components/ImageUrlGenerator'
import type {PluginOptions} from './types'

/**
 * Image URL Generator Plugin for Sanity Studio v3
 *
 * Provides a custom input component for generating responsive image URLs
 * with configurable aspect ratios, sizes, and formats.
 *
 * @public
 * @example
 * ```ts
 * import {imageUrlGenerator} from 'sanity-plugin-image-url-generator'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [
 *     imageUrlGenerator({
 *       defaultAspectRatio: '16:9',
 *       defaultWidths: [640, 1024, 1600]
 *     })
 *   ]
 * })
 * ```
 */
export const imageUrlGenerator = definePlugin<PluginOptions | void>((options = {}) => {
  return {
    name: 'sanity-plugin-image-url-generator',
    schema: {
      types: [
        {
          name: 'imageUrlGenerator',
          type: 'image',
          title: 'Image with URL Generator',
          options: {
            hotspot: true,
            ...options,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO and accessibility',
            },
          ],
          components: {
            input: ImageUrlGenerator as any,
          },
        },
      ],
    },
  }
})

/** @public */
export {ImageUrlGenerator} from './components/ImageUrlGenerator'
/** @public */
export {AspectRatioSelector} from './components/AspectRatioSelector'
/** @public */
export {SizeSelector} from './components/SizeSelector'
/** @public */
export {UrlDisplay} from './components/UrlDisplay'
/** @public */
export {CopyButton} from './components/CopyButton'

/** @public */
export {buildImageUrl, buildImageUrls, getPreviewUrl, type BuildImageUrlParams} from './utils/urlBuilder'
/** @public */
export {
  buildResponsiveHtml,
  buildMarkdown,
  buildJson,
  buildAllMarkup,
} from './utils/markupBuilder'
/** @public */
export {
  parseAspectRatio,
  calculateHeight,
  isValidAspectRatio,
  COMMON_ASPECT_RATIOS,
  COMMON_WIDTHS,
} from './utils/aspectRatioCalculator'

/** @public */
export type {
  FitMode,
  ImageFormat,
  CropData,
  HotspotData,
  SanityImageAsset,
  ImageUrlOptions,
  ResponsiveMarkupOptions,
  PluginOptions,
  ImageUrlGeneratorState,
  GeneratedUrls,
} from './types'
