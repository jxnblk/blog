
var _ = require('lodash');
var React = require('react');
var CrossPosted = require('./CrossPosted.jsx');

var Post = React.createClass({

  render: function() {
    var slug = this.props.params.post;
    var post = _.find(this.props.posts, function(post){
      return post.slug === slug;
    });
    var crossposted = post.crossposted;
    var body = { __html: post.html };
    var date = new Date(post.created).toDateString();
    return (
      <div className="py3 mb4">
        <div className="h5 bold">{date}</div>
        <h1 className="m0">{post.title}</h1>
        <h2 className="mt0">{post.subhead}</h2>
        <div
          className="prose mt4 mb4"
          dangerouslySetInnerHTML={body} />
        <CrossPosted links={crossposted} />
      </div>
    )
  }

});

module.exports = Post;

