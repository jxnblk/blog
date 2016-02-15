
import React from 'react'

class PostCard extends React.Component {

  render () {
    const { post } = this.props
    const date = new Date(post.created).toDateString()

    return (
      <div>
        <h2 className='f1 mb0'>
          <a href={'/writing/posts/' + post.slug}>
            {post.title}
            {post.subhead &&
              <div className='f2 mt1 mb1'>
                {post.subhead}
              </div>
            }
          </a>
        </h2>
        <p className='mb0'>{post.excerpt}</p>
        <a href={'/writing/posts/' + post.slug}
          className='sc'>
          Read more
        </a>
      </div>
    )
  }

}

PostCard.propTypes = {
  post: React.PropTypes.shape({
    title: React.PropTypes.string,
    subhead: React.PropTypes.string,
    excerpt: React.PropTypes.string,
    date: React.PropTypes.string,
    slug: React.PropTypes.string,
    draft: React.PropTypes.bool,
  })
}

export default PostCard

