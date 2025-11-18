import React, {useCallback, useEffect, useMemo, useState} from 'react'
import sanityClient from 'part:@sanity/base/client'
import type {SanityImageAssetDocument} from '@sanity/client'
import {buildAllMarkup} from '../utils/markupBuilder'
import {buildImageUrl, getPreviewUrl} from '../utils/urlBuilder'
import type {
  CropData,
  FitMode,
  HotspotData,
  ImageFormat,
  ImageUrlGeneratorState,
} from '../types'

// Simple copy button for V2
function CopyButton({text, label}: {text: string; label?: string}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#00a651' : '#2276fc',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginTop: '0.5rem',
      }}
    >
      {copied ? '✓ Copied!' : label || 'Copy'}
    </button>
  )
}

/**
 * Sanity V2 Tool Component for Image URL Generation
 * Provides a standalone interface to browse media library and generate URLs
 */
export default function ImageUrlGeneratorTool() {
  // V2 uses direct client import - memoize to avoid recreating on each render
  const client = useMemo(() => sanityClient.withConfig({apiVersion: '2023-01-01'}), [])

  // Get project configuration
  const config = client.config()
  const projectId = config.projectId || ''
  const dataset = config.dataset || ''

  // Media library state
  const [assets, setAssets] = useState<SanityImageAssetDocument[]>([])
  const [selectedAsset, setSelectedAsset] = useState<SanityImageAssetDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)

  // Hotspot and crop state
  const [hotspot, setHotspot] = useState<HotspotData | null>(null)
  const [crop, setCrop] = useState<CropData | null>(null)

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

  // Reset hotspot/crop when selecting a new asset
  const handleSelectAsset = useCallback((asset: SanityImageAssetDocument | null) => {
    setSelectedAsset(asset)
    setHotspot(null)
    setCrop(null)
  }, [])

  // Fetch assets from media library
  useEffect(() => {
    setIsLoadingAssets(true)
    const query = searchQuery
      ? `*[_type == "sanity.imageAsset" && (originalFilename match $search || title match $search)] | order(_createdAt desc) [0...50]`
      : `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...50]`

    client
      .fetch(query, {search: `*${searchQuery}*`})
      .then((fetchedAssets: SanityImageAssetDocument[]) => {
        console.log('Fetched assets:', fetchedAssets?.length || 0)
        setAssets(fetchedAssets || [])
        setIsLoadingAssets(false)
      })
      .catch((error: Error) => {
        console.error('Failed to fetch assets:', error)
        setAssets([])
        setIsLoadingAssets(false)
      })
  }, [searchQuery]) // client is stable via useMemo

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
        crop: crop || undefined,
        hotspot: hotspot || undefined,
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
    hotspot,
    crop,
  ])

  const updateState = useCallback(
    (updates: Partial<ImageUrlGeneratorState>) => {
      setState((prev) => ({...prev, ...updates}))
    },
    []
  )

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#666',
      fontSize: '0.95rem',
    },
    card: {
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    button: {
      background: '#2276fc',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    buttonGhost: {
      background: 'transparent',
      color: '#2276fc',
      border: '1px solid #2276fc',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d0d0d0',
      borderRadius: '4px',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      maxHeight: '400px',
      overflowY: 'auto' as const,
    },
    gridItem: {
      border: '2px solid #e0e0e0',
      borderRadius: '4px',
      padding: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    gridItemSelected: {
      border: '2px solid #2276fc',
      boxShadow: '0 2px 8px rgba(34, 118, 252, 0.2)',
    },
    gridImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
      borderRadius: '4px',
      marginBottom: '0.5rem',
    },
    gridText: {
      fontSize: '0.8rem',
      wordBreak: 'break-word' as const,
      marginBottom: '0.25rem',
    },
    gridMuted: {
      fontSize: '0.75rem',
      color: '#999',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d0d0d0',
      borderRadius: '4px',
      fontSize: '1rem',
      background: '#fff',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#999',
    },
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Image URL Generator</h1>
        <p style={styles.subtitle}>
          Select an image from your media library and generate responsive URLs
        </p>
      </div>

      {/* Media Browser */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Media Library</h2>
          {selectedAsset && (
            <button
              style={styles.buttonGhost}
              onClick={() => handleSelectAsset(null)}
            >
              Clear Selection
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search images by filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />

        {isLoadingAssets ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#999'}}>
            Loading images...
          </div>
        ) : assets.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#999'}}>
            No images found
          </div>
        ) : (
          <div style={styles.grid}>
            {assets.map((asset) => (
              <div
                key={asset._id}
                style={{
                  ...styles.gridItem,
                  ...(selectedAsset?._id === asset._id ? styles.gridItemSelected : {}),
                }}
                onClick={() => handleSelectAsset(asset)}
              >
                <img
                  src={`${asset.url}?w=300&h=200&fit=crop`}
                  alt={asset.originalFilename || ''}
                  style={styles.gridImage}
                />
                <div style={styles.gridText}>
                  {asset.originalFilename || 'Untitled'}
                </div>
                <div style={styles.gridMuted}>
                  {asset.metadata?.dimensions?.width} × {asset.metadata?.dimensions?.height}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotspot Picker */}
      {selectedAsset && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Hotspot & Crop</h2>
            {(hotspot || crop) && (
              <button
                style={styles.buttonGhost}
                onClick={() => {
                  setHotspot(null)
                  setCrop(null)
                }}
              >
                Reset
              </button>
            )}
          </div>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Click on the image to set the focal point (hotspot). This determines the center of focus when cropping.
          </p>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              cursor: 'crosshair',
              maxWidth: '100%',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width
              const y = (e.clientY - rect.top) / rect.height
              setHotspot({
                x: Math.max(0, Math.min(1, x)),
                y: Math.max(0, Math.min(1, y)),
                width: 0.3,
                height: 0.3,
              })
            }}
          >
            <img
              src={`${selectedAsset.url}?w=800`}
              alt={selectedAsset.originalFilename || ''}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '4px',
              }}
            />
            {/* Hotspot indicator */}
            {hotspot && (
              <div
                style={{
                  position: 'absolute',
                  left: `${hotspot.x * 100}%`,
                  top: `${hotspot.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(34, 118, 252, 0.8)',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* Crosshair guides */}
            {hotspot && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: `${hotspot.x * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'rgba(34, 118, 252, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: `${hotspot.y * 100}%`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'rgba(34, 118, 252, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}
          </div>
          {hotspot && (
            <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666'}}>
              <strong>Hotspot:</strong> X: {(hotspot.x * 100).toFixed(1)}%, Y: {(hotspot.y * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}

      {/* Configuration Panel */}
      {selectedAsset && (
        <>
          <div style={styles.card}>
            <h2 style={{...styles.cardTitle, marginBottom: '1.5rem'}}>
              Image URL Configuration
            </h2>

            <div style={styles.formGrid}>
              {/* Aspect Ratio */}
              <div>
                <label style={styles.label}>Aspect Ratio</label>
                <select
                  value={state.aspectRatio}
                  onChange={(e) => updateState({aspectRatio: e.target.value})}
                  style={styles.select}
                >
                  <option value="16:9">16:9 (Widescreen)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="21:9">21:9 (Ultra-wide)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="3:2">3:2 (Photo)</option>
                  <option value="2:3">2:3 (Portrait Photo)</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label style={styles.label}>Format</label>
                <select
                  value={state.format}
                  onChange={(e) => updateState({format: e.target.value as ImageFormat})}
                  style={styles.select}
                >
                  <option value="auto">Auto (recommended)</option>
                  <option value="webp">WebP</option>
                  <option value="jpg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
            </div>

            <div style={{...styles.formGrid, marginTop: '1.5rem'}}>
              {/* Quality */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <label style={styles.label}>Quality</label>
                  <span style={{fontSize: '0.9rem', color: '#666'}}>{state.quality}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={state.quality}
                  onChange={(e) => updateState({quality: parseInt(e.target.value, 10)})}
                  style={{width: '100%'}}
                />
              </div>

              {/* Fit Mode */}
              <div>
                <label style={styles.label}>Fit Mode</label>
                <select
                  value={state.fitMode}
                  onChange={(e) => updateState({fitMode: e.target.value as FitMode})}
                  style={styles.select}
                >
                  <option value="clip">Clip (default)</option>
                  <option value="crop">Crop</option>
                  <option value="fill">Fill</option>
                  <option value="fillmax">Fill Max</option>
                  <option value="max">Max</option>
                  <option value="scale">Scale</option>
                  <option value="min">Min</option>
                </select>
              </div>
            </div>

            {/* Widths */}
            <div style={{marginTop: '1.5rem'}}>
              <label style={styles.label}>Responsive Widths</label>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                {[320, 640, 768, 1024, 1366, 1600, 1920, 2400].map((width) => (
                  <label key={width} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input
                      type="checkbox"
                      checked={state.selectedWidths.includes(width)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateState({selectedWidths: [...state.selectedWidths, width].sort((a, b) => a - b)})
                        } else {
                          updateState({selectedWidths: state.selectedWidths.filter((w) => w !== width)})
                        }
                      }}
                    />
                    <span>{width}px</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generated URLs */}
          {generatedContent && state.selectedWidths.length > 0 && (
            <div style={styles.card}>
              <h2 style={{...styles.cardTitle, marginBottom: '1.5rem'}}>Generated URLs</h2>

              {/* Single URL */}
              <div style={{marginBottom: '1.5rem'}}>
                <label style={styles.label}>Single URL</label>
                <div style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  marginBottom: '0.5rem',
                }}>
                  {generatedContent.singleUrl}
                </div>
                <CopyButton text={generatedContent.singleUrl} label="Copy URL" />
              </div>

              {/* HTML */}
              <div style={{marginBottom: '1.5rem'}}>
                <label style={styles.label}>Responsive HTML</label>
                <div style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  marginBottom: '0.5rem',
                }}>
                  <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
                    {generatedContent.html}
                  </pre>
                </div>
                <CopyButton text={generatedContent.html} label="Copy HTML" />
              </div>

              {/* Markdown */}
              <div style={{marginBottom: '1.5rem'}}>
                <label style={styles.label}>Markdown</label>
                <div style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  marginBottom: '0.5rem',
                }}>
                  {generatedContent.markdown}
                </div>
                <CopyButton text={generatedContent.markdown} label="Copy Markdown" />
              </div>

              {/* JSON */}
              <div style={{marginBottom: '1.5rem'}}>
                <label style={styles.label}>JSON</label>
                <div style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  marginBottom: '0.5rem',
                }}>
                  <pre style={{margin: 0}}>
                    {JSON.stringify(JSON.parse(generatedContent.json), null, 2)}
                  </pre>
                </div>
                <CopyButton text={generatedContent.json} label="Copy JSON" />
              </div>

              {/* Preview */}
              {generatedContent.previewUrl && (
                <div>
                  <label style={styles.label}>Live Preview</label>
                  <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '1rem',
                    background: '#fafafa',
                  }}>
                    <img
                      src={generatedContent.previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!selectedAsset && !isLoadingAssets && (
        <div style={styles.emptyState}>
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Select an image to get started</h3>
          <p style={{fontSize: '0.95rem'}}>
            Choose an image from your media library above to generate responsive URLs
          </p>
        </div>
      )}
    </div>
  )
}
