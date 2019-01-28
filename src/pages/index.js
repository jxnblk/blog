import React from 'react'
import { graphql } from 'gatsby'

export const pageQuery = graphql`
  query {
    allMdx {
      edges {
        node {
          parent {
            ... on File {
              name
              absolutePath
              relativePath
            }
          }
          frontmatter {
            title
            created
          }
        }
      }
    }
  }
`

export default ({
  data: {
    allMdx: { edges }
  }
}) =>
  <>
    <h1>blog {edges.length}</h1>
    {edges.map(({ node }, i) => (
      console.log(node) || <pre key={i}>{node.frontmatter.title}</pre>
    ))}
  </>
