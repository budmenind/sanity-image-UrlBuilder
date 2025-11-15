import React from 'react'
import {Box, Card, Flex, Grid, Label, Select, Stack, Text, TextInput} from '@sanity/ui'
import {COMMON_ASPECT_RATIOS, isValidAspectRatio} from '../utils/aspectRatioCalculator'

/**
 * Props for AspectRatioSelector component
 * @public
 */
export interface AspectRatioSelectorProps {
  value: string
  onChange: (ratio: string) => void
  customWidth: string
  customHeight: string
  onCustomWidthChange: (width: string) => void
  onCustomHeightChange: (height: string) => void
  showCustom: boolean
  onShowCustomChange: (show: boolean) => void
}

/**
 * Component for selecting aspect ratios with preset options and custom input
 * @public
 */
export function AspectRatioSelector({
  value,
  onChange,
  customWidth,
  customHeight,
  onCustomWidthChange,
  onCustomHeightChange,
  showCustom,
  onShowCustomChange,
}: AspectRatioSelectorProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value
    if (newValue === 'custom') {
      onShowCustomChange(true)
      // If we have custom values, construct the ratio
      if (customWidth && customHeight) {
        onChange(`${customWidth}:${customHeight}`)
      }
    } else {
      onShowCustomChange(false)
      onChange(newValue)
    }
  }

  const handleCustomChange = () => {
    if (customWidth && customHeight) {
      const customRatio = `${customWidth}:${customHeight}`
      if (isValidAspectRatio(customRatio)) {
        onChange(customRatio)
      }
    }
  }

  return (
    <Stack space={3}>
      <Label size={1}>Aspect Ratio</Label>
      <Select value={showCustom ? 'custom' : value} onChange={handleSelectChange} fontSize={2}>
        {COMMON_ASPECT_RATIOS.map((ratio) => (
          <option key={ratio.value} value={ratio.value}>
            {ratio.label}
          </option>
        ))}
      </Select>

      {showCustom && (
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Custom Aspect Ratio
            </Text>
            <Grid columns={3} gap={2}>
              <TextInput
                type="number"
                min="1"
                step="1"
                value={customWidth}
                onChange={(event) => onCustomWidthChange((event.currentTarget as HTMLInputElement).value)}
                onBlur={handleCustomChange}
                placeholder="Width"
                fontSize={2}
              />
              <Flex align="center" justify="center">
                <Text size={2}>:</Text>
              </Flex>
              <TextInput
                type="number"
                min="1"
                step="1"
                value={customHeight}
                onChange={(event) => onCustomHeightChange((event.currentTarget as HTMLInputElement).value)}
                onBlur={handleCustomChange}
                placeholder="Height"
                fontSize={2}
              />
            </Grid>
            {customWidth && customHeight && (
              <Box>
                <Text size={1} muted>
                  Current ratio: {customWidth}:{customHeight}
                </Text>
              </Box>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
