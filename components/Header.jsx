
var React = require('react')
var _find = require('lodash').find

var Header = React.createClass({

  render: function() {
    var postTitle
    var params = this.props.params || false;
    if (params && params.post) {
      var slug = this.props.params.post
      var post = _find(this.props.posts, function(post) {
        return post.slug === slug
      })
      var date = new Date(post.created).toDateString();
      postTitle = (
        <div>
          <h1 className="mt1 mb0">{post.title}</h1>
          {post.subhead ? <h2 className="mt0">{post.subhead}</h2> : false }
          <div className="h5 bold">{date}</div>
        </div>
      )
    }
    return (
      <header className="py3">
        <h1 className="h3 m0">
          <a href="/writing" className="link-simple">
            {this.props.title}
          </a>
        </h1>
        {postTitle}
      </header>
    )
  }

});

module.exports = Header;

