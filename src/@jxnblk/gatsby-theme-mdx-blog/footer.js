import React from 'react'
import { Avatar } from 'jxnblk'
import {
  Styled,
  Box,
  Container,
} from '@jxnblk/gatsby-theme-mdx-blog'

export default props =>
  <Box
    as='footer'
    py={5}
    block='footer'>
    <Container
      css={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontSize: 14,
      }}>
        <Box ml={-3}>
          <Avatar size={48} color='currentcolor' />
        </Box>
        <Box mx={2}>
          <Styled.a href='https://jxnblk.com'>
            © 2019 Jxnblk
          </Styled.a>
        </Box>
        <Box mx={2}>
          <Styled.a href='https://github.com/jxnblk/blog'>
            GitHub
          </Styled.a>
        </Box>
        <Box mx={2}>
          Built with
          {' '}
          <Styled.a href='https://gatsbyjs.org'>
            Gatsby
          </Styled.a>
          {' & '}
          <Styled.a href='https://github.com/jxnblk/gatsby-theme-mdx-blog'>
            @jxnblk/gatsby-theme-mdx-blog
          </Styled.a>
        </Box>
    </Container>
  </Box>

