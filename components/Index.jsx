
var React = require('react');

var Index = React.createClass({

  renderPost: function(post, i) {
    if (post.draft) { return false }
    var date = new Date(post.created).toDateString();
    return (
      <li key={'post-'+i} className="mb3">
        <span className="h5 bold">{date}</span>
        <h2 className="mt0">
          <a href={'/writing/posts/'+post.slug}>
            {post.title}
          </a>
        </h2>
        <p className="serif">{post.excerpt}</p>
      </li>
    )
  },

  render: function() {
    return (
      <div className="py3">
        <ul className="list-reset">
          {this.props.posts.map(this.renderPost)}
        </ul>
      </div>
    )
  }

});

module.exports = Index;

