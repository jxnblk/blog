
var _ = require('lodash');
var moment = require('moment');
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
    var date = moment(post.date).format('MMMM D, YYYY');
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

