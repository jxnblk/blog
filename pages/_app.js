import React from 'react'
import { Link } from 'react-router-dom'
import RebassMDX from '@rebass/mdx'
import UI from './_scope'

const Script = ({ src }) =>
  <script
    dangerouslySetInnerHTML={{
      __html: src
    }}
  />

export default ({ children, route }) =>
  <RebassMDX>
    <React.Fragment>
      <UI.Flex>
        <UI.Container>
          <header>
            <UI.BlockLink is={Link} to='/'>
              <UI.Heading
                is='h1'
                href='/'
                css={`
                  font-size: 16px;
                  text-transform: uppercase;
                  letter-spacing: .2em;
                  margin-top: 6em;
                `}
              >
                {route.props.title || 'Jxnblk Writing'}
              </UI.Heading>
            </UI.BlockLink>
            {route.props.created && <UI.pre>{route.props.created.toDateString()}</UI.pre>}
          </header>
          <main>
            {children}
          </main>
          <footer>
            <UI.BlockLink href='https://jxnblk.com'>
              Made by Jxnblk
            </UI.BlockLink>
          </footer>
        </UI.Container>
        <UI.Right />
      </UI.Flex>
      <Script src={ga} />
    </React.Fragment>
  </RebassMDX>


// <Script src={twttr} />
// const twttr = '!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document, "script", "twitter-wjs");'
const ga = '(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,"script","//www.google-analytics.com/analytics.js","ga"); ga("create", "UA-4603832-6", "auto"); ga("send", "pageview");'
