import {ImageIcon} from '@sanity/icons'

export default {
  title: 'Image URL Generator',
  name: 'image-url-generator',
  icon: ImageIcon,
  component: () => import('./ImageUrlGeneratorTool'),
}
