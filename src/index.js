import React from 'react'
import { Link } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import { BlockLink, Heading, Text, Pre } from 'rebass'

export { Root } from './components'

export default ({ routes = [] }) => {
  const filtered = [...routes]
    .filter(r => !!r.module.frontMatter)
    .filter(r => r.name !== 'index')
  const posts = sortBy(filtered, route => route.module.frontMatter.created)
    .map(route => ({ ...route, props: route.module.frontMatter }))
    .map(route => ({ ...route, ...route.props }))
    .filter(route => !route.draft)
    .reverse()

  return (
    <React.Fragment>
      {posts.map(post => (
        <BlockLink
          key={post.name}
          is={Link}
          mb={4}
          to={post.path}>
          <Heading fontSize={[ 5 ]} mb={2}>{post.title}</Heading>
          <Pre>{new Date(post.created).toDateString()}</Pre>
        </BlockLink>
      ))}
    </React.Fragment>
  )
}
