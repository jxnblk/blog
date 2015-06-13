
var React = require('react')
var PostTitle = require('./PostTitle.jsx')

var Header = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    posts: React.PropTypes.array,
    title: React.PropTypes.string
  },

  render: function () {
    var postTitle
    if (this.props.post) {
      postTitle = <PostTitle post={this.props.post} />
    }
    return (
      <header className='py3'>
        <h1 className='h4 m0'>
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

