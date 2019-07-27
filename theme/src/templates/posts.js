import React from 'react'
import { graphql } from 'gatsby'
import Posts from '../posts'

export default props => {
  const posts = props.data.posts.edges
    .map(e => e.node)

  return (
    <Posts
      {...props}
      posts={posts}
    />
  )
}

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    posts: allPost(
      sort: {
        fields: date,
        order: DESC
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          slug
          date
          title
          excerpt
        }
      }
    }
  }
`
