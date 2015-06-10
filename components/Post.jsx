
var React = require('react')
var CrossPosted = require('./CrossPosted.jsx')
var Related = require('./Related.jsx')
var Issues = require('./Issues.jsx')
var TweetButton = require('./TweetButton.jsx')

var Post = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    posts: React.PropTypes.array
  },

  render: function () {
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

})

module.exports = Post

