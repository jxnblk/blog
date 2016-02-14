
import React from 'react'
import PostDate from './PostDate'

class PostTitle extends React.Component {

  render () {
    var post = this.props.post
    return (
      <div>
        <h1 className='mt1 mb0'>{post.title}</h1>
        {post.subhead ? <h2 className='m0'>{post.subhead}</h2> : false }
        <div className='mt1'>
          <PostDate date={post.created} />
        </div>
      </div>
    )
  }

}

PostTitle.propTypes = {
  post: React.PropTypes.shape({
    title: React.PropTypes.string,
    subhead: React.PropTypes.string,
    date: React.PropTypes.string
  })
}

export default PostTitle

