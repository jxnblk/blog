import React from 'react'
import { Helmet } from 'react-helmet'
import get from 'lodash.get'
import Layout from './layout'

const Page = props => {
  let title = 'Jxnblk'
  const postTitle = get(props.data, 'post.title')
  const description = get(props.data, 'post.excerpt')
  if (postTitle) {
    title = `${postTitle} | ${title}`
  }

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
        <meta name='twitter:site' content='@jxnblk' />
        <meta name='og:image' content='https://jxnblk.com/avatar.png' />
        <title>{title}</title>
        <meta name='og:title' content={title} />
        <meta name='og:description' content={description} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:creator' content='Brent Jackson' />
        <meta name='twitter:card' content='summary' />
      </Helmet>
      <Layout {...props}>
        {props.children}
      </Layout>
    </>
  )
}

export const wrapPageElement = ({ element, props }) =>
  <Page {...props}>
    {element}
  </Page>
