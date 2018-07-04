import React from 'react'
import { Link } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import { BlockLink, Heading, Text, Pre } from 'rebass'

export default ({ routes = []}) => {
  const posts =
    sortBy([...routes]
      .filter(r => !!r.props)
      .filter(r => r.name !== 'index'),
      route => route.props.created)
    .map(route => ({ ...route, ...route.props }))
    .filter(route => !route.draft)
    .reverse()

  return (
    <React.Fragment>
      {posts.map(post => (
        <BlockLink
          key={post.name}
          is={Link}
          mb={5}
          to={post.path}>
          <Heading fontSize={[ 5, null, 6 ]} mb={3}>{post.title}</Heading>
          {post.excerpt && <Text is='p' mb={3}>{post.excerpt}</Text>}
          <Pre>{new Date(post.created).toDateString()}</Pre>
        </BlockLink>
      ))}
    </React.Fragment>
  )
}
