/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { Avatar } from 'jxnblk'

export default props =>
  <footer sx={{ py: 5 }}>
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontSize: 14,
        maxWidth: 768,
        mx: 'auto',
        px: 3,
      }}>
      <div sx={{ ml: -3 }}>
        <Avatar size={48} color='currentcolor' />
      </div>
      <div sx={{ mx: 2 }}>
        <Styled.a href='https://jxnblk.com'>
          © 2019 Jxnblk
        </Styled.a>
      </div>
      <div sx={{ mx: 2 }}>
        <Styled.a href='https://github.com/jxnblk/blog'>
          GitHub
        </Styled.a>
      </div>
      <div sx={{ mx: 2 }}>
        Built with
        {' '}
        <Styled.a href='https://gatsbyjs.org'>
          Gatsby
        </Styled.a>
        {' & '}
        <Styled.a href='https://github.com/jxnblk/gatsby-theme-mdx-blog'>
          @jxnblk/gatsby-theme-mdx-blog
        </Styled.a>
      </div>
    </div>
  </footer>

