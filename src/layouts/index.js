import React from 'react'
import { Helmet } from 'react-helmet'
import { MDXProvider } from '@mdx-js/tag'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { maxWidth, space } from 'styled-system'

const Style = createGlobalStyle({
  '*': { boxSizing: 'border-box' },
  body: {
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.5,
    margin: 0,
  },
  ['@media (prefers-color-scheme: dark)']: {
    body: {
      color: 'white',
      backgroundColor: 'black'
    }
  }
})

const theme = {
}

const components = {
}

const Container = styled.div({
  maxWidth: '768px',
}, space)

export default props =>
  <ThemeProvider theme={theme}>
    <MDXProvider components={components}>
      <>
        <Style />
        <Helmet>
          <title>Jxnblk Blog</title>
          <meta
            name='description'
            content='The writing of Brent Jackson'
          />
        </Helmet>
        <Container
          mx='auto'
          px={3}
          py={4}>
          {props.children}
        </Container>
      </>
    </MDXProvider>
  </ThemeProvider>
