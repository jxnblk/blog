import React from 'react'
import { graphql } from 'gatsby'
import Posts from '../layouts/posts'

export default Posts

export const query = graphql`
  query archiveIndex($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            draft
          }
          excerpt
        }
      }
    }
  }
`
