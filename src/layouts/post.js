import React from 'react'
import moment from 'moment'
import Timestamp from '../components/Timestamp'

export default ({
  children,
  pageContext: {
    frontmatter,
    ...page
  },
  ...props
}) =>  // console.log(props, page, frontmatter) ||
  <>
    {children}
    <Timestamp my={5}>
      Posted on {moment(frontmatter.date).format('MMMM DD, YYYY')}
    </Timestamp>
  </>
