import React from 'react'
import { Helmet } from 'react-helmet'

const Page = props => {
  return (
    <>
      <Helmet>
        <link
          rel='icon'
          type='image/png'
          href='https://jxnblk.com/favicon.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          href='https://jxnblk.com/avatar.png'
        />
        <meta
          name='twitter:site'
          content='@jxnblk'
        />
        <meta name='twitter:image' content='https://jxnblk.com/avatar.png' />
      </Helmet>
      {props.children}
    </>
  )
}

export const wrapPageElement = ({ element, props }) =>
  <Page {...props}>
    {element}
  </Page>
