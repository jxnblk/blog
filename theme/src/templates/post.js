import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Post from '../post'

export default props => {
  const { post } = props.data
  const children = <MDXRenderer children={post.body} />

  return (
    <Post
      {...props}
      {...post}
      children={children}
    />
  )
}

export const query = graphql`
  query ($id: String!) {
    post(id: { eq: $id }) {
      id
      date(formatString: "MMMM DD, YYYY")
      title
      body
      tags
      draft
    }
  }
`
