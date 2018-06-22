import React from 'react'
import { Link } from 'react-router-dom'
import sortBy from 'lodash.sortby'
import UI from './_scope'

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
    <div>
      {posts.map(post => (
        <div key={post.name}>
          <UI.BlockLink
            is={Link}
            to={post.path}>
            <UI.Heading>{post.title}</UI.Heading>
            {post.excerpt && <UI.p>{post.excerpt}</UI.p>}
            <UI.pre>{new Date(post.created).toDateString()}</UI.pre>
          </UI.BlockLink>
        </div>
      ))}
    </div>
  )
}
