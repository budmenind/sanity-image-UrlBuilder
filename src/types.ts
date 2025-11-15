import type {SanityImageAssetDocument} from '@sanity/client'

export type FitMode = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
export type ImageFormat = 'auto' | 'jpg' | 'png' | 'webp'

export interface CropData {
  _type: 'sanity.imageCrop'
  top: number
  bottom: number
  left: number
  right: number
}

export interface HotspotData {
  _type: 'sanity.imageHotspot'
  x: number
  y: number
  height: number
  width: number
}

export interface SanityImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: CropData
  hotspot?: HotspotData
}

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

export interface PluginOptions {
  defaultAspectRatio?: string
  defaultWidths?: number[]
  allowedFormats?: ImageFormat[]
  defaultQuality?: number
  defaultFit?: FitMode
  customAspectRatios?: Array<{label: string; value: string}>
  customWidths?: number[]
}

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

export interface GeneratedUrls {
  single: string
  html: string
  markdown: string
  json: string
}
