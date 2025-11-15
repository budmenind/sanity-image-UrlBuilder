import {buildImageUrl, buildImageUrls} from './urlBuilder'
import {calculateHeight} from './aspectRatioCalculator'
import type {ResponsiveMarkupOptions} from '../types'

/**
 * Generate responsive HTML markup with srcset
 */
export function buildResponsiveHtml(options: ResponsiveMarkupOptions): string {
  const {
    projectId,
    dataset,
    asset,
    widths,
    aspectRatio,
    alt,
    fit,
    quality,
    format,
    crop,
    hotspot,
    sizesAttribute,
  } = options

  // Get all URLs for different widths
  const urls = buildImageUrls({
    projectId,
    dataset,
    asset,
    widths,
    aspectRatio,
    fit,
    quality,
    format,
    crop,
    hotspot,
  })

  // Use the middle width as the base src (or 800px if available)
  const baseSrc =
    urls.find((u) => u.width === 800)?.url || urls[Math.floor(urls.length / 2)].url
  const baseWidth = urls.find((u) => u.width === 800)?.width || urls[Math.floor(urls.length / 2)].width

  // Build srcset string
  const srcset = urls.map((u) => `${u.url} ${u.width}w`).join(',\n    ')

  // Calculate height for base width
  const height = calculateHeight(baseWidth, aspectRatio)

  // Default sizes attribute if not provided
  const sizes =
    sizesAttribute ||
    '(max-width: 640px) 100vw, (max-width: 1200px) 50vw, ' + baseWidth + 'px'

  return `<img
  src="${baseSrc}"
  srcset="${srcset}"
  sizes="${sizes}"
  alt="${alt || ''}"
  width="${baseWidth}"
  height="${height}"
  loading="lazy"
/>`
}

/**
 * Generate Markdown image syntax with URL
 */
export function buildMarkdown(options: ResponsiveMarkupOptions): string {
  const {projectId, dataset, asset, widths, aspectRatio, alt, fit, quality, format, crop, hotspot} =
    options

  // Use the largest width for Markdown
  const maxWidth = Math.max(...widths)
  const url = buildImageUrl({
    projectId,
    dataset,
    asset,
    width: maxWidth,
    aspectRatio,
    fit,
    quality,
    format,
    crop,
    hotspot,
  })

  return `![${alt || ''}](${url})`
}

/**
 * Generate JSON object with all URLs
 */
export function buildJson(options: ResponsiveMarkupOptions): object {
  const {projectId, dataset, asset, widths, aspectRatio, alt, fit, quality, format, crop, hotspot} =
    options

  const urls = buildImageUrls({
    projectId,
    dataset,
    asset,
    widths,
    aspectRatio,
    fit,
    quality,
    format,
    crop,
    hotspot,
  })

  return {
    alt: alt || '',
    aspectRatio,
    fit,
    quality,
    format: format || 'auto',
    sources: urls.map((u) => ({
      url: u.url,
      width: u.width,
      height: calculateHeight(u.width, aspectRatio),
    })),
  }
}

/**
 * Build all markup formats at once
 */
export function buildAllMarkup(options: ResponsiveMarkupOptions): {
  html: string
  markdown: string
  json: string
} {
  return {
    html: buildResponsiveHtml(options),
    markdown: buildMarkdown(options),
    json: JSON.stringify(buildJson(options), null, 2),
  }
}
