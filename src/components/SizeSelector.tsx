import React from 'react'
import {Box, Card, Checkbox, Flex, Grid, Label, Stack, Text, TextInput} from '@sanity/ui'
import {COMMON_WIDTHS} from '../utils/aspectRatioCalculator'

/**
 * Props for SizeSelector component
 * @public
 */
export interface SizeSelectorProps {
  selectedWidths: number[]
  onChange: (widths: number[]) => void
  customWidth: string
  onCustomWidthChange: (width: string) => void
}

/**
 * Component for selecting image widths with preset options and custom input
 * @public
 */
export function SizeSelector({
  selectedWidths,
  onChange,
  customWidth,
  onCustomWidthChange,
}: SizeSelectorProps) {
  const handleToggleWidth = (width: number) => {
    if (selectedWidths.includes(width)) {
      onChange(selectedWidths.filter((w) => w !== width))
    } else {
      onChange([...selectedWidths, width].sort((a, b) => a - b))
    }
  }

  const handleCustomWidthAdd = () => {
    const width = parseInt(customWidth, 10)
    if (width > 0 && !selectedWidths.includes(width)) {
      onChange([...selectedWidths, width].sort((a, b) => a - b))
      onCustomWidthChange('')
    }
  }

  const handleSelectAll = () => {
    onChange([...COMMON_WIDTHS])
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <Stack space={3}>
      <Flex align="center" justify="space-between">
        <Label size={1}>Image Widths</Label>
        <Flex gap={2}>
          <Text
            size={1}
            style={{cursor: 'pointer', textDecoration: 'underline'}}
            onClick={handleSelectAll}
          >
            Select All
          </Text>
          <Text muted size={1}>
            |
          </Text>
          <Text
            size={1}
            style={{cursor: 'pointer', textDecoration: 'underline'}}
            onClick={handleClearAll}
          >
            Clear
          </Text>
        </Flex>
      </Flex>

      <Card border padding={3} radius={2}>
        <Grid columns={[2, 3, 4]} gap={3}>
          {COMMON_WIDTHS.map((width) => (
            <Checkbox
              key={width}
              checked={selectedWidths.includes(width)}
              onChange={() => handleToggleWidth(width)}
            >
              <Text size={2}>{width}px</Text>
            </Checkbox>
          ))}
        </Grid>
      </Card>

      <Card border padding={3} radius={2}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Add Custom Width
          </Text>
          <Flex gap={2}>
            <Box flex={1}>
              <TextInput
                type="number"
                min="1"
                step="1"
                value={customWidth}
                onChange={(event) => onCustomWidthChange((event.currentTarget as HTMLInputElement).value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleCustomWidthAdd()
                  }
                }}
                placeholder="Enter width in pixels"
                fontSize={2}
              />
            </Box>
            <button
              type="button"
              onClick={handleCustomWidthAdd}
              disabled={!customWidth || parseInt(customWidth, 10) <= 0}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                cursor: customWidth && parseInt(customWidth, 10) > 0 ? 'pointer' : 'not-allowed',
                opacity: customWidth && parseInt(customWidth, 10) > 0 ? 1 : 0.5,
              }}
            >
              Add
            </button>
          </Flex>
        </Stack>
      </Card>

      {selectedWidths.length > 0 && (
        <Box>
          <Text size={1} muted>
            Selected: {selectedWidths.join(', ')}px
          </Text>
        </Box>
      )}
    </Stack>
  )
}
