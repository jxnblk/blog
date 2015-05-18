
var _ = require('lodash');
var moment = require('moment');
var React = require('react');

var Post = React.createClass({

  render: function() {
    var slug = this.props.params.post;
    var post = _.find(this.props.posts, function(post){
      return post.slug === slug;
    });
    var body = { __html: post.html };
    var date = moment(post.date).format('MMMM D, YYYY');
    return (
      <div className="py3 mb4">
        <h1 className="m0">{post.title}</h1>
        <h2 className="mt0">{post.subhead}</h2>
        <div className="h5">{date}</div>
        <div
          className="prose mt4"
          dangerouslySetInnerHTML={body} />
      </div>
    )
  }

});

module.exports = Post;

