import React from 'react'
import { Head, Link } from 'mdx-go'
import RebassMDX from '@rebass/mdx'
import {
  Flex,
  Box,
  Container,
  Heading,
  BlockLink,
  Pre,
} from 'rebass'
import get from 'lodash.get'

const Script = ({ src }) =>
  <script
    dangerouslySetInnerHTML={{
      __html: src
    }}
  />

const ga = '(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,"script","//www.google-analytics.com/analytics.js","ga"); ga("create", "UA-4603832-6", "auto"); ga("send", "pageview");'


export const Root = ({
  children,
  location,
  routes,
  ...props
}) => {
  const route = routes.find(route => route.path === location.pathname)
  const title = get(route, 'module.frontMatter.title', 'Jxnblk Writing')
  const image = 'https://jxnblk.com/avatar.png'

  return (
    <RebassMDX>
      <React.Fragment>
        <Head>
          <title>{title}</title>
          <meta name='description' content='The personal blog of Brent Jackson' />
          <meta name='author' content='Brent Jackson' />
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:site' content='@jxnblk' />
          <meta name='twitter:title' content={title} />
          <meta name='twitter:image' content={image} />
        </Head>
        <Container pb={6}>
          <header>
            <BlockLink is={Link} href='/'>
              <Heading
                is='h1'
                href='/'
                mt={5}
                mb={5}>
                Jxnblk Writing
              </Heading>
            </BlockLink>
          </header>
          <Box
            is='main'
            flex='none'
            mr={[ 0, 0, 256 ]}
            css={{ lineHeight: 1.625 }}>
            {children}
            {get(route, 'module.frontMatter.created.toDateString') && (
              <Pre mt={4}>{route.module.frontMatter.created.toDateString()}</Pre>
            )}
          </Box>
          <footer>
            <Flex mt={6}>
              <BlockLink href='https://jxnblk.com'>
                Made by Jxnblk
              </BlockLink>
            </Flex>
          </footer>
        </Container>
        <Script src={ga} />
      </React.Fragment>
    </RebassMDX>
  )
}
