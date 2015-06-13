
var React = require('react')
var PostDate = require('./PostDate.jsx')

var PostCard = React.createClass({

  propTypes: {
    post: React.PropTypes.shape({
      title: React.PropTypes.string,
      subhead: React.PropTypes.string,
      excerpt: React.PropTypes.string,
      date: React.PropTypes.string,
      slug: React.PropTypes.string,
      draft: React.PropTypes.bool,
    })
  },

  render: function() {
    var post = this.props.post
    return (
      <div>
        <a href={'/writing/posts/' + post.slug}
          className='link-block'>
          <h2 className='m0'>
            {post.title}
          </h2>
          {post.subhead ? <h3 className='mt0'>{post.subhead}</h3> : false }
        </a>
        <PostDate date={post.created} />
        <p className='georgia h3 m0'>{post.excerpt}</p>
        <div className=''>
          <a href={'/writing/posts/' + post.slug}
            className='h5 bold mr1'>
            Read more
          </a>
        </div>
      </div>
    )
  }

})

module.exports = PostCard

