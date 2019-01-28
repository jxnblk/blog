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
}) =>
  <>
    <Helmet>
      <meta name='twitter:title' content={frontmatter.title} />
    </Helmet>
    {children}
    <Timestamp my={5}>
      Posted on {moment(frontmatter.date).format('MMMM DD, YYYY')}
    </Timestamp>
  </>
