import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { space } from 'styled-system'
import Heading from '../components/Heading'
import Timestamp from '../components/Timestamp'

const List = styled.ul({
  listStyle: 'none',
  padding: 0,
})

const Pagination = styled.div({
  display: 'flex',
  justifyContents: 'space-between',
  paddingTop: 32,
  paddingBottom: 32,
})

const Spacer = styled.div({
  margin: 'auto',
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
  fields: {
    slug,
  },
  // parent: { name, },
  excerpt,
}) =>
  <BlockLink to={slug} my={4}>
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
  },
  pageContext: {
    previous,
    next,
  },
}) =>
  <>
    <List>
      {edges
        .map(({ node }, i) => (
        <li key={i}>
          <PostLink {...node} />
        </li>
      ))}
    </List>
    <Pagination>
      {previous && (
        <BlockLink to={previous}>
          <b>Previous</b>
        </BlockLink>
      )}
      <Spacer />
      {next && (
        <BlockLink to={next}>
          <b>Next</b>
        </BlockLink>
      )}
    </Pagination>
  </>
