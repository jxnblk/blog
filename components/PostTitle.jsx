
var React = require('react')
var PostDate = require('./PostDate.jsx')

var PostTitle = React.createClass({

  propTypes: {
    post: React.PropTypes.shape({
      title: React.PropTypes.string,
      subhead: React.PropTypes.string,
      date: React.PropTypes.string
    })
  },

  render: function() {
    var post = this.props.post
    return (
      <div>
        <h1 className='mt1 mb0'>{post.title}</h1>
        {post.subhead ? <h2 className='mt0'>{post.subhead}</h2> : false }
        <PostDate date={post.created} />
      </div>
    )
  }

})

module.exports = PostTitle

