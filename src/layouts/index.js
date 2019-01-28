import React from 'react'
import { Link as GLink } from 'gatsby'
import { Helmet } from 'react-helmet'
import { MDXProvider } from '@mdx-js/tag'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { space, fontSize, fontWeight, } from 'styled-system'
import Slugger from 'github-slugger'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Heading from '../components/Heading'
import Link from '../components/Link'

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
  colors: {
    magenta: '#a0a',
    blue: '#33e',
  }
}

const slugger = new Slugger()

const UnstyledLink = styled.a({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'underline'
  }
})

const heading = (tag, style = {}) => ({ children, ...props }) => {
  slugger.reset()
  const id = slugger.slug(children)
  return (
    <Heading
      as={tag}
      id={id}
      {...style}
      {...props}>
      <UnstyledLink href={'#' + id}>
        {children}
      </UnstyledLink>
    </Heading>
  )
}

const Pre = styled.pre({
  fontFamily: '"Roboto Mono", Menlo, sans-serif',
  color: '#a0a',
}, space, fontSize)

Pre.defaultProps = {
  fontSize: 2,
  my: 4,
}

const Code = styled.code({
  fontFamily: '"Roboto Mono", Menlo, sans-serif',
  fontSize: '87.5%',
  color: '#a0a',
})

const Text = styled.p({
  lineHeight: 1.625,
}, space, fontSize, fontWeight)

Text.defaultProps = {
  fontSize: [ 2, 3 ],
}

const UL = props => <Text as='ul' {...props} />
const OL = props => <Text as='ol' {...props} />

const Blockquote = props =>
  <Text
    as='blockquote'
    fontSize={4}
    fontWeight='bold'
    my={5}
    {...props}
  />

const Image = styled.img({
  maxWidth: '100%',
  height: 'auto',
})

const HR = styled.hr({
  border: 0,
  borderBottom: '1px solid',
  marginTop: '32px',
  marginBottom: '32px',
})

const components = {
  h1: heading('h1', {
    fontSize: [ 5, 6 ],
    mt: 5,
  }),
  h2: heading('h2', {
    fontSize: [ 4, 5 ],
    mt: 5,
  }),
  h3: heading('h3', {
    fontSize: 4,
    mt: 5,
  }),
  h4: heading('h4', {
    mt: 4,
  }),
  h5: heading('h5', {
    mt: 4,
  }),
  h6: heading('h6', {}),
  p: Text,
  a: Link,
  ul: UL,
  ol: OL,
  blockquote: Blockquote,
  img: Image,
  pre: props => props.children,
  code: Pre,
  inlineCode: Code,
  hr: HR,
}

const Container = styled.div({
  // maxWidth: '768px',
  maxWidth: '832px',
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
          <meta name='author' content='Brent Jackson' />
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:site' content='@jxnblk' />
          <meta name='twitter:image' content='https://jxnblk.com/avatar.png' />
        </Helmet>
        <Container
          mx='auto'
          px={[ 3, 4 ]}
          py={5}>
          <Header {...props} />
          {props.children}
          <Footer {...props} />
        </Container>
      </>
    </MDXProvider>
  </ThemeProvider>
