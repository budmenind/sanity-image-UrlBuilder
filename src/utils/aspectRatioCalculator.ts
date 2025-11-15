/**
 * Parse aspect ratio string (e.g., "16:9") into width and height values
 * @public
 */
export function parseAspectRatio(ratio: string): {width: number; height: number} {
  const [widthStr, heightStr] = ratio.split(':')
  const width = parseFloat(widthStr)
  const height = parseFloat(heightStr)

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    throw new Error(`Invalid aspect ratio: ${ratio}`)
  }

  return {width, height}
}

/**
 * Calculate height from width and aspect ratio
 * @public
 */
export function calculateHeight(width: number, aspectRatio: string): number {
  const {width: ratioWidth, height: ratioHeight} = parseAspectRatio(aspectRatio)
  return Math.round((width * ratioHeight) / ratioWidth)
}

/**
 * Validate aspect ratio string format
 * @public
 */
export function isValidAspectRatio(ratio: string): boolean {
  try {
    parseAspectRatio(ratio)
    return true
  } catch {
    return false
  }
}

/**
 * Common aspect ratios for quick selection
 * @public
 */
export const COMMON_ASPECT_RATIOS = [
  {label: '16:9 (Widescreen)', value: '16:9'},
  {label: '4:3 (Standard)', value: '4:3'},
  {label: '1:1 (Square)', value: '1:1'},
  {label: '3:2 (Classic)', value: '3:2'},
  {label: '21:9 (Ultrawide)', value: '21:9'},
  {label: '9:16 (Portrait)', value: '9:16'},
  {label: '2:3 (Portrait)', value: '2:3'},
  {label: 'Custom', value: 'custom'},
]

/**
 * Common width presets for responsive images
 * @public
 */
export const COMMON_WIDTHS = [320, 480, 640, 800, 1024, 1200, 1600, 2400]
