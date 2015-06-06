
var React = require('react')

var Head = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    author: React.PropTypes.string,
    css: React.PropTypes.string
  },

  render: function () {
    var post = this.props.post
    var keywords = this.props.keywords
    if (post && post.tags) {
      keywords = keywords.concat(post.tags)
    }
    return (
      <head>
        <meta charSet='utf-8' />
        <title>{post ? (post.title + ' | ' + this.props.title) : this.props.title}</title>
        <meta name='description' content={this.props.description} />
        <meta name='author' content={this.props.author} />
        <meta name='keywords' content={keywords.join()} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
      </head>
    )
  }

})

module.exports = Head

