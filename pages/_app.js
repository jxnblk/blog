import React from 'react'
import { Link } from 'react-router-dom'
import RebassMDX from '@rebass/mdx'
import {
  Flex,
  Box,
  Container,
  Heading,
  BlockLink,
  Pre,
} from 'rebass'

const Script = ({ src }) =>
  <script
    dangerouslySetInnerHTML={{
      __html: src
    }}
  />

const Right = props =>
  <Box
    {...props}
    width={[ 0, 0, 320 ]}
  />

export default ({ children, route }) =>
  <RebassMDX>
    <React.Fragment>
      <Flex>
        <Container
          pb={6}
          maxWidth={768}>
          <header>
            <BlockLink is={Link} to='/'>
              <Heading
                is='h1'
                href='/'
                mt={5}
                mb={5}>
                Jxnblk Writing
              </Heading>
            </BlockLink>
          </header>
          <main>
            {children}
            {route && route.props && route.props.created && typeof route.props.created.toDateString === 'function' && (
              <Pre mt={4}>{route.props.created.toDateString()}</Pre>
            )}
          </main>
          <footer>
            <Flex mt={6}>
              <BlockLink href='https://jxnblk.com'>
                Made by Jxnblk
              </BlockLink>
            </Flex>
          </footer>
        </Container>
        <Right />
      </Flex>
      <Script src={ga} />
    </React.Fragment>
  </RebassMDX>


// <Script src={twttr} />
// const twttr = '!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document, "script", "twitter-wjs");'
const ga = '(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,"script","//www.google-analytics.com/analytics.js","ga"); ga("create", "UA-4603832-6", "auto"); ga("send", "pageview");'
