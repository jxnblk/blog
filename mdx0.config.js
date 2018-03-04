import theme from './src/theme'
import components from './src/components'
import layout from './src/Layout'

export default props => ({
  title: 'Jxnblk Writing',
  description: 'Design, Development, & Minimalism',
  author: 'Brent Jackson',
  twitter: {
    card: 'summary',
    site: '@jxnblk',
    title: 'Jxnblk Writing',
    description: 'Design, Development, & Minimalism',
    image: 'http://jxnblk.com/avatar.png',
  },
  theme,
  components,
  layout,
  routes: [
    ...props.files.map(f => ({ ...f,
      path: '/posts' + f.path
    }))
  ]
})
