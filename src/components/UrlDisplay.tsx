import React, {useState} from 'react'
import {Box, Card, Code, Flex, Label, Stack, Tab, TabList, TabPanel, Text} from '@sanity/ui'
import {CopyButton} from './CopyButton'

/**
 * Props for UrlDisplay component
 * @public
 */
export interface UrlDisplayProps {
  singleUrl: string
  html: string
  markdown: string
  json: string
  previewUrl: string
}

/**
 * Component for displaying and copying generated URLs in multiple formats
 * @public
 */
export function UrlDisplay({singleUrl, html, markdown, json, previewUrl}: UrlDisplayProps) {
  const [activeTab, setActiveTab] = useState('html')

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Label size={1}>Single URL</Label>
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Code size={1} style={{wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>
              {singleUrl}
            </Code>
            <Flex gap={2}>
              <CopyButton text={singleUrl} label="Copy URL" />
              <a
                href={singleUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{textDecoration: 'none'}}
              >
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Preview
                </button>
              </a>
            </Flex>
          </Stack>
        </Card>
      </Stack>

      <Stack space={3}>
        <Label size={1}>Responsive Markup</Label>
        <Card border radius={2}>
          <TabList space={2}>
            <Tab
              aria-controls="html-panel"
              id="html-tab"
              label="HTML"
              onClick={() => setActiveTab('html')}
              selected={activeTab === 'html'}
              fontSize={2}
              padding={3}
            />
            <Tab
              aria-controls="markdown-panel"
              id="markdown-tab"
              label="Markdown"
              onClick={() => setActiveTab('markdown')}
              selected={activeTab === 'markdown'}
              fontSize={2}
              padding={3}
            />
            <Tab
              aria-controls="json-panel"
              id="json-tab"
              label="JSON"
              onClick={() => setActiveTab('json')}
              selected={activeTab === 'json'}
              fontSize={2}
              padding={3}
            />
          </TabList>

          {activeTab === 'html' && (
            <TabPanel aria-labelledby="html-tab" id="html-panel" padding={3}>
              <Stack space={3}>
                <Code size={1} style={{whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto'}}>
                  {html}
                </Code>
                <Box>
                  <CopyButton text={html} label="Copy HTML" />
                </Box>
              </Stack>
            </TabPanel>
          )}

          {activeTab === 'markdown' && (
            <TabPanel aria-labelledby="markdown-tab" id="markdown-panel" padding={3}>
              <Stack space={3}>
                <Code size={1} style={{whiteSpace: 'pre-wrap'}}>
                  {markdown}
                </Code>
                <Box>
                  <CopyButton text={markdown} label="Copy Markdown" />
                </Box>
              </Stack>
            </TabPanel>
          )}

          {activeTab === 'json' && (
            <TabPanel aria-labelledby="json-tab" id="json-panel" padding={3}>
              <Stack space={3}>
                <Code size={1} style={{whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto'}}>
                  {json}
                </Code>
                <Box>
                  <CopyButton text={json} label="Copy JSON" />
                </Box>
              </Stack>
            </TabPanel>
          )}
        </Card>
      </Stack>

      <Stack space={3}>
        <Label size={1}>Live Preview</Label>
        <Card border padding={3} radius={2}>
          <Box style={{maxWidth: '100%', overflow: 'hidden'}}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '4px',
              }}
            />
          </Box>
          <Box paddingTop={2}>
            <Text size={1} muted>
              Preview image (800px width)
            </Text>
          </Box>
        </Card>
      </Stack>
    </Stack>
  )
}
