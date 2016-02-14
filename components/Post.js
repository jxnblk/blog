
import React from 'react'
import CrossPosted from './CrossPosted'
import Related from './Related'
import Issues from './Issues'
import TweetButton from './TweetButton'
import DraftMessage from './DraftMessage'

class Post extends React.Component {

  render () {
    var post = this.props.post

    console.log('Post props', Object.keys(this.props.post))
    console.log('POST', post.title)
    return (
      <div className=''>
        {post.draft ? <DraftMessage /> : false}
        <div
          className='prose mb3'
          dangerouslySetInnerHTML={{ __html: post.html }} />
        <CrossPosted links={post.crossposted} />
        <div className='py3'>
          <TweetButton {...this.props} />
        </div>
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

