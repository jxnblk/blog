
var React = require('react');

var Index = React.createClass({

  renderPost: function(post, i) {
    return (
      <li key={'post-'+i}>
        <h2>
          <a href={'/writing/'+post.slug}>
            {post.title}
          </a>
        </h2>
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

