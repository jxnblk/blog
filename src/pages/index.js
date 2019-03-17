import React from 'react'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'
import { space } from 'styled-system'
import Heading from '../components/Heading'
import Timestamp from '../components/Timestamp'

export const pageQuery = graphql`
  query {
    allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
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
            date(formatString: "MMMM DD, YYYY")
            draft
          }
          excerpt
        }
      }
    }
  }
`

const List = styled.ul({
  listStyle: 'none',
  padding: 0,
})

const BlockLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block'
}, space)

const PostLink = ({
  frontmatter: {
    title,
    date,
  },
  parent: {
    name,
  },
  excerpt,
}) =>
  <BlockLink to={'/' + name} my={4}>
    <Heading
      as='h3'
      mb={0}
      fontSize={[ 5, 6 ]}>
      {title}
    </Heading>
    <Timestamp my={3}>{date}</Timestamp>
  </BlockLink>

export default ({
  data: {
    allMdx: { edges }
  }
}) =>
  <>
    <List>
      {edges
        .filter(({ node }) => !node.frontmatter.draft)
        .map(({ node }, i) => (
        <li key={i}>
          <PostLink {...node} />
        </li>
      ))}
    </List>
  </>
