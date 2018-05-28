import React from 'react'
import { Link } from 'react-router-dom'
import posts from '../posts'

export default () =>
  <div>
    <h1>Writing</h1>
    <ul>
      {posts.map(post => (
        <li key={post.name}>
          <Link to={post.path}>
            {post.name}
            <pre>{post.created.toDateString()}</pre>
          </Link>
        </li>
      ))}
    </ul>
  </div>
