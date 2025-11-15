import type {SanityImageAssetDocument} from '@sanity/client'

/**
 * Image fit mode options for Sanity CDN transformations
 * @public
 */
export type FitMode = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'

/**
 * Image format options
 * @public
 */
export type ImageFormat = 'auto' | 'jpg' | 'png' | 'webp'

/**
 * Sanity image crop data
 * @public
 */
export interface CropData {
  _type: 'sanity.imageCrop'
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Sanity image hotspot data
 * @public
 */
export interface HotspotData {
  _type: 'sanity.imageHotspot'
  x: number
  y: number
  height: number
  width: number
}

/**
 * Sanity image asset reference with crop and hotspot
 * @public
 */
export interface SanityImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: CropData
  hotspot?: HotspotData
}

/**
 * Options for building image URLs
 * @public
 */
export interface ImageUrlOptions {
  asset: SanityImageAssetDocument
  width: number
  aspectRatio: string
  fit: FitMode
  quality: number
  format?: ImageFormat
  crop?: CropData
  hotspot?: HotspotData
}

/**
 * Options for building responsive markup
 * @public
 */
export interface ResponsiveMarkupOptions {
  projectId: string
  dataset: string
  asset: SanityImageAssetDocument
  widths: number[]
  aspectRatio: string
  alt: string
  fit: FitMode
  quality: number
  format?: ImageFormat
  crop?: CropData
  hotspot?: HotspotData
  sizesAttribute?: string
}

/**
 * Plugin configuration options
 * @public
 */
export interface PluginOptions {
  defaultAspectRatio?: string
  defaultWidths?: number[]
  allowedFormats?: ImageFormat[]
  defaultQuality?: number
  defaultFit?: FitMode
  customAspectRatios?: Array<{label: string; value: string}>
  customWidths?: number[]
}

/**
 * Internal state for ImageUrlGenerator component
 * @public
 */
export interface ImageUrlGeneratorState {
  aspectRatio: string
  selectedWidths: number[]
  customWidth: string
  format: ImageFormat
  quality: number
  fitMode: FitMode
  showCustomAspectRatio: boolean
  customAspectWidth: string
  customAspectHeight: string
}

/**
 * Generated URL output formats
 * @public
 */
export interface GeneratedUrls {
  single: string
  html: string
  markdown: string
  json: string
}
