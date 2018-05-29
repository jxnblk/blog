import React from 'react'
import { Link } from 'react-router-dom'
import posts from '../posts'
import UI from './_scope'

export default () =>
  <div>
    {posts.map(post => (
      <div key={post.name}>
        <UI.BlockLink
          is={Link}
          to={post.path}>
          <UI.Heading>{post.title}</UI.Heading>
          {post.excerpt && <UI.p>{post.excerpt}</UI.p>}
          <UI.pre>{post.created.toDateString()}</UI.pre>
        </UI.BlockLink>
      </div>
    ))}
  </div>
