import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageAssetDocument} from '@sanity/client'
import {calculateHeight} from './aspectRatioCalculator'
import type {CropData, FitMode, HotspotData, ImageFormat} from '../types'

// Define SanityImageSource interface locally
interface SanityImageSource {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: CropData
  hotspot?: HotspotData
}

/**
 * Parameters for building image URLs
 * @public
 */
export interface BuildImageUrlParams {
  projectId: string
  dataset: string
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
 * Build a single image URL with transformations
 * @public
 */
export function buildImageUrl(params: BuildImageUrlParams): string {
  const {projectId, dataset, asset, width, aspectRatio, fit, quality, format, crop, hotspot} =
    params

  const builder = imageUrlBuilder({projectId, dataset})

  // Create the base image reference
  const imageSource: SanityImageSource = {
    _type: 'image',
    asset: {
      _ref: asset._id,
      _type: 'reference',
    },
  }

  // Add crop and hotspot if available
  if (crop) {
    imageSource.crop = crop
  }
  if (hotspot) {
    imageSource.hotspot = hotspot
  }

  // Build the URL with transformations
  let urlBuilder = builder.image(imageSource).width(width).fit(fit).quality(quality)

  // Calculate and set height based on aspect ratio
  const height = calculateHeight(width, aspectRatio)
  urlBuilder = urlBuilder.height(height)

  // Set format if specified (auto format is handled differently)
  if (format && format !== 'auto') {
    urlBuilder = urlBuilder.format(format)
  } else if (format === 'auto') {
    urlBuilder = urlBuilder.auto('format')
  }

  return urlBuilder.url()
}

/**
 * Build multiple image URLs for different widths
 * @public
 */
export function buildImageUrls(
  params: Omit<BuildImageUrlParams, 'width'> & {widths: number[]}
): Array<{width: number; url: string}> {
  const {widths, ...baseParams} = params

  return widths.map((width) => ({
    width,
    url: buildImageUrl({...baseParams, width}),
  }))
}

/**
 * Get a preview URL for the image (medium size, optimized for UI display)
 * @public
 */
export function getPreviewUrl(params: Omit<BuildImageUrlParams, 'width'>): string {
  return buildImageUrl({...params, width: 800})
}
