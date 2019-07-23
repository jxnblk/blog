import theme from '@jxnblk/gatsby-theme-mdx-blog/src/gatsby-plugin-theme-ui'

export default {
  ...theme,
  colors: {
    ...theme.colors,
    secondary: '#228',
    muted: '#f9faff',
  },
  fontSizes: [
    12, 14, 18, 20, 24, 32, 48, 64, 72
  ],
  styles: {
    ...theme.styles,
    // todo: update
    root: {
      fontSize: 2,
    },
    p: {
      fontSize: 2,
    },
    inlineCode: {
      ...theme.styles.inlineCode,
      bg: 'muted',
      fontSize: '87.5%',
    },
  }
}
