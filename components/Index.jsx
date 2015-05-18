
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Index = React.createClass({

  renderPost: function(post, i) {
    return (
      <li key={'post-'+i}>
        <h2>
          <Link to={'/'+post.slug}>
            {post.title}
          </Link>
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

