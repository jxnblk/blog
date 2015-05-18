
var React = require('react');
var moment = require('moment');

var Index = React.createClass({

  renderPost: function(post, i) {
    var date = moment(post.date).format('MMMM D, YYYY');
    return (
      <li key={'post-'+i} className="mb3">
        <span className="h5">{date}</span>
        <h2 className="m0">
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

