
import React from 'react'
import CrossPosted from './CrossPosted.jsx'
import Related from './Related.jsx'
import Issues from './Issues.jsx'
import TweetButton from './TweetButton.jsx'
import DraftMessage from './DraftMessage.jsx'
//import HireMe from './HireMe.jsx'

class Post extends React.Component {

  render () {
    var post = this.props.post

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

