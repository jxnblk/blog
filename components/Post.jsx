
import React from 'react'
import CrossPosted from './CrossPosted.jsx'
import Related from './Related.jsx'
import Issues from './Issues.jsx'
import TweetButton from './TweetButton.jsx'

class Post extends React.Component {

  render () {
    var post = this.props.post

    return (
      <div className='py2'>
        <div
          className='prose mb3'
          dangerouslySetInnerHTML={{ __html: post.html }} />
        <Related links={post.related} />
        <CrossPosted links={post.crossposted} />
        <Issues title={post.title} />
        <div className='mt3'>
          <TweetButton {...this.props} />
        </div>
      </div>
    )
  }

}

Post.propTypes = {
  params: React.PropTypes.object,
  posts: React.PropTypes.array
}

export default Post

