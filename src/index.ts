/**
 * Image URL Generator Plugin for Sanity Studio
 *
 * Works with both Sanity Studio V2 and V3:
 *
 * **Sanity V2**: Provides a standalone tool accessible from the Studio topbar
 * that allows you to browse your media library and generate responsive URLs.
 * The tool is automatically registered via sanity.json.
 *
 * **Sanity V3**: Can also be used as a custom input component (optional).
 *
 * @public
 */

// V3 plugin support (optional - for document field usage)
import type {PluginOptions} from './types'

/**
 * Optional V3 plugin for using as a document field type
 * Note: Most users will want the V2 tool instead
 * @public
 */
export const imageUrlGenerator = (options: PluginOptions = {}) => {
  return {
    name: 'sanity-plugin-image-url-generator',
    title: 'Image URL Generator',
  }
}

/** @public */
export {ImageUrlGenerator, type ImageUrlGeneratorProps} from './components/ImageUrlGenerator'
/** @public */
export {AspectRatioSelector, type AspectRatioSelectorProps} from './components/AspectRatioSelector'
/** @public */
export {SizeSelector, type SizeSelectorProps} from './components/SizeSelector'
/** @public */
export {UrlDisplay, type UrlDisplayProps} from './components/UrlDisplay'
/** @public */
export {CopyButton, type CopyButtonProps} from './components/CopyButton'

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
