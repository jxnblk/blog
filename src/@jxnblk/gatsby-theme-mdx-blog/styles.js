import merge from 'lodash.merge'
import styles from '@jxnblk/gatsby-theme-mdx-blog/src/styles'

export default merge({}, styles, {
  inlineCode: {
    bg: 'muted',
    fontSize: '87.5%',
  }
})
