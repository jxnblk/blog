/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'

export default ({
  posts,
}) =>
  <ul>
    {posts.map(post => (
      <li key={post.id}>
        <Link to={post.slug}>
          {post.title || post.slug}
        </Link>
      </li>
    ))}
  </ul>
