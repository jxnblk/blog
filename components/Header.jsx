
var React = require('react')

var Header = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    posts: React.PropTypes.array,
    title: React.PropTypes.string
  },

  render: function () {
    var postTitle
    var post = this.props.post
    if (post) {
      var date = new Date(post.created).toDateString()
      postTitle = (
        <div>
          <h1 className='mt1 mb0'>{post.title}</h1>
          {post.subhead ? <h2 className='mt0'>{post.subhead}</h2> : false }
          <div className='h5 bold mt1'>{date}</div>
        </div>
      )
    }
    return (
      <header className='py3'>
        <h1 className='h3 m0'>
          <a href='/writing' className='link-simple'>
            {this.props.title}
          </a>
        </h1>
        {postTitle}
      </header>
    )
  }

})

module.exports = Header

