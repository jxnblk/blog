
import React from 'react'
import PostDate from './PostDate'

class PostCard extends React.Component {

  render () {
    var post = this.props.post
    return (
      <div>
        <h2 className='f1 mb0'>
          <a href={'/writing/posts/' + post.slug}>
            {post.title}
            {post.subhead &&
              <div className='f2 mt0 mb1'>
                {post.subhead}
              </div>
            }
          </a>
        </h2>
        <div className='sc'>{post.created}</div>
        <p className='mt1 mb0'>{post.excerpt}</p>
        <div className=''>
          <a href={'/writing/posts/' + post.slug}
            className='bold mr1'>
            Read more
          </a>
        </div>
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

