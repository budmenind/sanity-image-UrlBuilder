import React, {useState} from 'react'
import {Button, Tooltip} from '@sanity/ui'
import {ClipboardIcon, CheckmarkIcon} from '@sanity/icons'

/**
 * Props for CopyButton component
 * @public
 */
export interface CopyButtonProps {
  text: string
  label?: string
  tone?: 'default' | 'primary' | 'positive' | 'caution' | 'critical'
}

/**
 * A button that copies text to clipboard with visual feedback
 * @public
 */
export function CopyButton({text, label = 'Copy', tone = 'default'}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <Tooltip
      content={
        <div style={{padding: 8}}>
          {copied ? 'Copied!' : `Click to copy ${label.toLowerCase()}`}
        </div>
      }
      placement="top"
    >
      <Button
        icon={copied ? CheckmarkIcon : ClipboardIcon}
        mode="ghost"
        tone={copied ? 'positive' : tone}
        onClick={handleCopy}
        text={copied ? 'Copied!' : label}
        fontSize={1}
      />
    </Tooltip>
  )
}
