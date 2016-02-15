
import React from 'react'
import CrossPosted from './CrossPosted'
import Related from './Related'
import Issues from './Issues'
import TweetButton from './TweetButton'
import DraftMessage from './DraftMessage'

class Post extends React.Component {

  render () {
    var post = this.props.post

    return (
      <div className=''>
        {post.draft ? <DraftMessage /> : false}
        <div
          className='mb4'
          dangerouslySetInnerHTML={{ __html: post.html }} />
        <CrossPosted links={post.crossposted} />
        <TweetButton {...this.props} />
        <Issues title={post.title} />
        <Related links={post.related} />
      </div>
    )
  }

}

Post.propTypes = {
  params: React.PropTypes.object,
  posts: React.PropTypes.array
}

export default Post

