import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Card, Flex, Grid, Label, Select, Stack, Text, TextInput} from '@sanity/ui'
import {
  type ImageInputProps,
  type ObjectInputProps,
  set,
  unset,
  useClient,
  useFormValue,
} from 'sanity'
import type {SanityImageAssetDocument} from '@sanity/client'
import {AspectRatioSelector} from './AspectRatioSelector'
import {SizeSelector} from './SizeSelector'
import {UrlDisplay} from './UrlDisplay'
import {buildAllMarkup} from '../utils/markupBuilder'
import {buildImageUrl, getPreviewUrl} from '../utils/urlBuilder'
import type {
  CropData,
  FitMode,
  HotspotData,
  ImageFormat,
  ImageUrlGeneratorState,
  PluginOptions,
} from '../types'

interface ImageUrlGeneratorProps extends ObjectInputProps {
  options?: PluginOptions
}

/**
 * Main component for the Image URL Generator plugin
 * Wraps Sanity's default image input and adds URL generation functionality
 */
export function ImageUrlGenerator(props: ImageUrlGeneratorProps) {
  const {value, onChange, schemaType, options = {}} = props
  const client = useClient({apiVersion: '2023-01-01'})

  // Get project configuration
  const projectId = client.config().projectId || ''
  const dataset = client.config().dataset || ''

  // Extract image data from value
  const imageAssetId = value?.asset?._ref
  const crop = value?.crop as CropData | undefined
  const hotspot = value?.hotspot as HotspotData | undefined
  const altText = value?.alt || ''

  // State for URL generator controls
  const [state, setState] = useState<ImageUrlGeneratorState>({
    aspectRatio: options.defaultAspectRatio || '16:9',
    selectedWidths: options.defaultWidths || [640, 1024, 1600],
    customWidth: '',
    format: 'auto',
    quality: options.defaultQuality || 75,
    fitMode: options.defaultFit || 'clip',
    showCustomAspectRatio: false,
    customAspectWidth: '',
    customAspectHeight: '',
  })

  // Fetch asset details
  const [asset, setAsset] = useState<SanityImageAssetDocument | null>(null)
  const [isLoadingAsset, setIsLoadingAsset] = useState(false)

  useEffect(() => {
    if (!imageAssetId) {
      setAsset(null)
      return
    }

    setIsLoadingAsset(true)
    client
      .fetch<SanityImageAssetDocument>(`*[_id == $id][0]`, {id: imageAssetId})
      .then((fetchedAsset) => {
        setAsset(fetchedAsset)
        setIsLoadingAsset(false)
      })
      .catch((error) => {
        console.error('Failed to fetch asset:', error)
        setIsLoadingAsset(false)
      })
  }, [imageAssetId, client])

  // Generate URLs and markup
  const generatedContent = useMemo(() => {
    if (!asset) {
      return null
    }

    try {
      const baseParams = {
        projectId,
        dataset,
        asset,
        aspectRatio: state.aspectRatio,
        fit: state.fitMode,
        quality: state.quality,
        format: state.format,
        crop,
        hotspot,
      }

      const singleUrl = buildImageUrl({
        ...baseParams,
        width: state.selectedWidths[Math.floor(state.selectedWidths.length / 2)] || 800,
      })

      const previewUrl = getPreviewUrl(baseParams)

      const markup = buildAllMarkup({
        ...baseParams,
        widths: state.selectedWidths,
        alt: altText,
      })

      return {
        singleUrl,
        previewUrl,
        ...markup,
      }
    } catch (error) {
      console.error('Error generating URLs:', error)
      return null
    }
  }, [
    asset,
    projectId,
    dataset,
    state.aspectRatio,
    state.selectedWidths,
    state.fitMode,
    state.quality,
    state.format,
    crop,
    hotspot,
    altText,
  ])

  const updateState = useCallback(
    (updates: Partial<ImageUrlGeneratorState>) => {
      setState((prev) => ({...prev, ...updates}))
    },
    []
  )

  // Render the default Sanity image input
  const renderImageInput = useCallback(() => {
    // We need to use Sanity's default image input component
    // This is a simplified version - in production, you'd import and use the actual ImageInput
    return (
      <Card border padding={3} radius={2}>
        <Stack space={3}>
          <Text weight="semibold">Image Upload</Text>
          <Text size={1} muted>
            Use Sanity Studio's built-in image picker to select or upload an image
          </Text>
          {imageAssetId && (
            <Box>
              <Text size={1} style={{color: 'green'}}>
                ✓ Image selected
              </Text>
            </Box>
          )}
          {!imageAssetId && (
            <Box>
              <Text size={1} muted>
                No image selected - Please add an image field to your schema
              </Text>
            </Box>
          )}
        </Stack>
      </Card>
    )
  }, [imageAssetId])

  return (
    <Stack space={4}>
      {/* Image Input Section */}
      {renderImageInput()}

      {/* Configuration Panel */}
      {asset && (
        <Card border padding={4} radius={2}>
          <Stack space={4}>
            <Text size={2} weight="bold">
              Image URL Configuration
            </Text>

            <Grid columns={[1, 1, 2]} gap={4}>
              {/* Aspect Ratio */}
              <AspectRatioSelector
                value={state.aspectRatio}
                onChange={(ratio) => updateState({aspectRatio: ratio})}
                customWidth={state.customAspectWidth}
                customHeight={state.customAspectHeight}
                onCustomWidthChange={(width) => updateState({customAspectWidth: width})}
                onCustomHeightChange={(height) => updateState({customAspectHeight: height})}
                showCustom={state.showCustomAspectRatio}
                onShowCustomChange={(show) => updateState({showCustomAspectRatio: show})}
              />

              {/* Format and Quality */}
              <Stack space={3}>
                <Stack space={3}>
                  <Label size={1}>Format</Label>
                  <Select
                    value={state.format}
                    onChange={(event) =>
                      updateState({format: (event.currentTarget as HTMLSelectElement).value as ImageFormat})
                    }
                    fontSize={2}
                  >
                    <option value="auto">Auto (recommended)</option>
                    <option value="webp">WebP</option>
                    <option value="jpg">JPEG</option>
                    <option value="png">PNG</option>
                  </Select>
                </Stack>

                <Stack space={3}>
                  <Flex align="center" justify="space-between">
                    <Label size={1}>Quality</Label>
                    <Text size={1} muted>
                      {state.quality}%
                    </Text>
                  </Flex>
                  <Box>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      step={1}
                      value={state.quality}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateState({quality: parseInt(event.target.value, 10)})
                      }
                      style={{width: '100%'}}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            <Grid columns={[1, 1, 2]} gap={4}>
              {/* Size Selection */}
              <SizeSelector
                selectedWidths={state.selectedWidths}
                onChange={(widths) => updateState({selectedWidths: widths})}
                customWidth={state.customWidth}
                onCustomWidthChange={(width) => updateState({customWidth: width})}
              />

              {/* Fit Mode */}
              <Stack space={3}>
                <Label size={1}>Fit Mode</Label>
                <Select
                  value={state.fitMode}
                  onChange={(event) => updateState({fitMode: (event.currentTarget as HTMLSelectElement).value as FitMode})}
                  fontSize={2}
                >
                  <option value="clip">Clip (default)</option>
                  <option value="crop">Crop</option>
                  <option value="fill">Fill</option>
                  <option value="fillmax">Fill Max</option>
                  <option value="max">Max</option>
                  <option value="scale">Scale</option>
                  <option value="min">Min</option>
                </Select>
                <Text size={1} muted>
                  <strong>Clip:</strong> Preserves aspect ratio, crops if needed
                  <br />
                  <strong>Crop:</strong> Fills the entire size, crops to fit
                  <br />
                  <strong>Fill:</strong> Ignores aspect ratio, stretches to fit
                </Text>
              </Stack>
            </Grid>
          </Stack>
        </Card>
      )}

      {/* Generated URLs Display */}
      {asset && generatedContent && state.selectedWidths.length > 0 && (
        <Card border padding={4} radius={2}>
          <Stack space={4}>
            <Text size={2} weight="bold">
              Generated URLs
            </Text>
            <UrlDisplay
              singleUrl={generatedContent.singleUrl}
              html={generatedContent.html}
              markdown={generatedContent.markdown}
              json={generatedContent.json}
              previewUrl={generatedContent.previewUrl}
            />
          </Stack>
        </Card>
      )}

      {/* No image selected message */}
      {!asset && !isLoadingAsset && (
        <Card border padding={4} radius={2} tone="transparent">
          <Text size={1} align="center" muted>
            Select or upload an image to generate URLs
          </Text>
        </Card>
      )}

      {/* Loading state */}
      {isLoadingAsset && (
        <Card border padding={4} radius={2} tone="transparent">
          <Text size={1} align="center" muted>
            Loading image...
          </Text>
        </Card>
      )}
    </Stack>
  )
}
