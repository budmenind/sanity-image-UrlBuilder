import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Container, Flex, Grid, Heading, Label, Select, Stack, Text, TextInput} from '@sanity/ui'
import sanityClient from 'part:@sanity/base/client'
import type {SanityImageAssetDocument} from '@sanity/client'
import {AspectRatioSelector} from '../components/AspectRatioSelector'
import {SizeSelector} from '../components/SizeSelector'
import {UrlDisplay} from '../components/UrlDisplay'
import {buildAllMarkup} from '../utils/markupBuilder'
import {buildImageUrl, getPreviewUrl} from '../utils/urlBuilder'
import type {
  CropData,
  FitMode,
  HotspotData,
  ImageFormat,
  ImageUrlGeneratorState,
} from '../types'

/**
 * Sanity V2 Tool Component for Image URL Generation
 * Provides a standalone interface to browse media library and generate URLs
 */
export default function ImageUrlGeneratorTool() {
  // V2 uses direct client import, not a hook
  const client = sanityClient.withConfig({apiVersion: '2023-01-01'})

  // Get project configuration
  const config = client.config()
  const projectId = config.projectId || ''
  const dataset = config.dataset || ''

  // Media library state
  const [assets, setAssets] = useState<SanityImageAssetDocument[]>([])
  const [selectedAsset, setSelectedAsset] = useState<SanityImageAssetDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)

  // URL generator state
  const [state, setState] = useState<ImageUrlGeneratorState>({
    aspectRatio: '16:9',
    selectedWidths: [640, 1024, 1600],
    customWidth: '',
    format: 'auto',
    quality: 75,
    fitMode: 'clip',
    showCustomAspectRatio: false,
    customAspectWidth: '',
    customAspectHeight: '',
  })

  // Fetch assets from media library
  useEffect(() => {
    setIsLoadingAssets(true)
    const query = searchQuery
      ? `*[_type == "sanity.imageAsset" && (originalFilename match $search || title match $search)] | order(_createdAt desc) [0...50]`
      : `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...50]`

    client
      .fetch<SanityImageAssetDocument[]>(query, {search: `*${searchQuery}*`})
      .then((fetchedAssets: SanityImageAssetDocument[]) => {
        setAssets(fetchedAssets)
        setIsLoadingAssets(false)
      })
      .catch((error: Error) => {
        console.error('Failed to fetch assets:', error)
        setIsLoadingAssets(false)
      })
  }, [client, searchQuery])

  // Generate URLs and markup
  const generatedContent = useMemo(() => {
    if (!selectedAsset) {
      return null
    }

    try {
      const baseParams = {
        projectId,
        dataset,
        asset: selectedAsset,
        aspectRatio: state.aspectRatio,
        fit: state.fitMode,
        quality: state.quality,
        format: state.format,
        crop: undefined as CropData | undefined,
        hotspot: undefined as HotspotData | undefined,
      }

      const singleUrl = buildImageUrl({
        ...baseParams,
        width: state.selectedWidths[Math.floor(state.selectedWidths.length / 2)] || 800,
      })

      const previewUrl = getPreviewUrl(baseParams)

      const markup = buildAllMarkup({
        ...baseParams,
        widths: state.selectedWidths,
        alt: selectedAsset.altText || selectedAsset.originalFilename || '',
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
    selectedAsset,
    projectId,
    dataset,
    state.aspectRatio,
    state.selectedWidths,
    state.fitMode,
    state.quality,
    state.format,
  ])

  const updateState = useCallback(
    (updates: Partial<ImageUrlGeneratorState>) => {
      setState((prev) => ({...prev, ...updates}))
    },
    []
  )

  return (
    <Container width={4} padding={4}>
      <Stack space={5}>
        {/* Header */}
        <Box paddingY={3}>
          <Heading size={3}>Image URL Generator</Heading>
          <Text size={1} muted style={{marginTop: '0.5rem'}}>
            Select an image from your media library and generate responsive URLs
          </Text>
        </Box>

        {/* Media Browser */}
        <Card border padding={4} radius={2}>
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Text size={2} weight="bold">
                Media Library
              </Text>
              {selectedAsset && (
                <Button
                  mode="ghost"
                  text="Clear Selection"
                  onClick={() => setSelectedAsset(null)}
                  fontSize={1}
                />
              )}
            </Flex>

            {/* Search */}
            <TextInput
              placeholder="Search images by filename..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              fontSize={2}
            />

            {/* Asset Grid */}
            {isLoadingAssets ? (
              <Box padding={4}>
                <Text size={1} align="center" muted>
                  Loading images...
                </Text>
              </Box>
            ) : assets.length === 0 ? (
              <Box padding={4}>
                <Text size={1} align="center" muted>
                  No images found
                </Text>
              </Box>
            ) : (
              <Box style={{maxHeight: '400px', overflowY: 'auto'}}>
                <Grid columns={[2, 3, 4]} gap={3}>
                  {assets.map((asset) => (
                    <Card
                      key={asset._id}
                      padding={2}
                      radius={2}
                      shadow={selectedAsset?._id === asset._id ? 2 : 1}
                      tone={selectedAsset?._id === asset._id ? 'primary' : 'default'}
                      style={{cursor: 'pointer'}}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <Box>
                        <img
                          src={`${asset.url}?w=300&h=200&fit=crop`}
                          alt={asset.originalFilename || ''}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '4px',
                          }}
                        />
                        <Box paddingTop={2}>
                          <Text size={0} style={{wordBreak: 'break-word'}}>
                            {asset.originalFilename || 'Untitled'}
                          </Text>
                          <Text size={0} muted>
                            {asset.metadata?.dimensions?.width} × {asset.metadata?.dimensions?.height}
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Configuration Panel - Only show if image is selected */}
        {selectedAsset && (
          <>
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

            {/* Generated URLs Display */}
            {generatedContent && state.selectedWidths.length > 0 && (
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
          </>
        )}

        {/* Empty State */}
        {!selectedAsset && !isLoadingAssets && (
          <Card padding={5} radius={2} tone="transparent">
            <Stack space={3}>
              <Text size={2} align="center" weight="semibold">
                Select an image to get started
              </Text>
              <Text size={1} align="center" muted>
                Choose an image from your media library above to generate responsive URLs
              </Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
