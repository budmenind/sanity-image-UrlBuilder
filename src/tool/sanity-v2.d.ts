/**
 * Type declarations for Sanity V2 parts system
 */

declare module 'part:@sanity/base/client' {
  import type {SanityClient} from '@sanity/client'
  const client: SanityClient
  export default client
}

declare module 'part:@sanity/base/image-icon' {
  import type {ComponentType} from 'react'
  const ImageIcon: ComponentType
  export default ImageIcon
}
