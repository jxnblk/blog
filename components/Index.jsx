
var React = require('react')
var PostCard = require('./PostCard.jsx')
var PostDate = require('./PostDate.jsx')

var Index = React.createClass({

  propTypes: {
    posts: React.PropTypes.array
  },

  renderPost: function (post, i) {
    if (post.draft) { return false }
    return (
      <li key={'post-' + i} className='mb3'>
        <PostCard post={post} />
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

