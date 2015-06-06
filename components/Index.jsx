
var React = require('react')

var Index = React.createClass({

  propTypes: {
    posts: React.PropTypes.array
  },

  renderPost: function (post, i) {
    if (post.draft) { return false }
    var date = new Date(post.created).toDateString()
    return (
      <li key={'post-' + i} className='mb3'>
        <h2 className='mt0'>
          <a href={'/writing/posts/' + post.slug}>
            {post.title}
          </a>
        </h2>
        <p className='serif m0'>{post.excerpt}</p>
        <div className=''>
          <span className='h5 bold mr1'>{date}</span>
          <a href={'/writing/posts/' + post.slug}
            className='h5 bold'>
            Read more
          </a>
        </div>
      </li>
    )
  },

  render: function () {
    return (
      <div className='py3'>
        <ul className='list-reset'>
          {this.props.posts.map(this.renderPost)}
        </ul>
      </div>
    )
  }

})

module.exports = Index

