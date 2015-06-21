
import React from 'react'

class TweetButton extends React.Component {

  render () {
    var script = {
      __html: this.props.tweetScript
    }
    var text = this.props.title
    if (this.props.post) {
      text = this.props.post.title
    }
    return (
      <div className="inline-block">
        <a href="https://twitter.com/share"
          className="twitter-share-button"
          data-text={text}
          data-via="jxnblk"
          data-size="large">
          Tweet
        </a>
        <script dangerouslySetInnerHTML={script} />
      </div>
    )
  }

}

export default TweetButton

