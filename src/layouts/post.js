import React from 'react'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Timestamp from '../components/Timestamp'

export default ({
  children,
  pageContext: {
    frontmatter,
  },
  ...props
}) => {
  const title = 'Jxnblog: ' + frontmatter.title
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name='twitter:title' content={title} />
      </Helmet>
      {children}
      <Timestamp my={5}>
        Posted on {moment(frontmatter.date).format('MMMM DD, YYYY')}
      </Timestamp>
    </>
  )
}
