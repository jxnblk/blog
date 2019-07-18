import theme from '@jxnblk/gatsby-theme-mdx-blog/src/gatsby-plugin-theme-ui'

export default {
  ...theme,
  colors: {
    ...theme.colors,
    secondary: '#228',
    muted: '#f9faff',
  },
  styles: {
    ...theme.styles,
    inlineCode: {
      ...theme.styles.inlineCode,
      bg: 'muted',
      fontSize: '87.5%',
    },
    ol: {
      fontSize: [2, 3],
    },
    ul: {
      fontSize: [2, 3],
    }
  }
}
