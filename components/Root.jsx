
var React = require('react')
var _find = require('lodash').find
var Head = require('./Head.jsx')
var Body = require('./Body.jsx')

var Root = React.createClass({

  render: function () {
    var post = false
    var params = this.props.params || false
    if (params && params.post) {
      var slug = params.post
      post = _find(this.props.posts, function(p) {
        return p.slug === slug
      })
    }
    return (
      <html>
        <Head {...this.props} post={post} />
        <Body {...this.props} post={post} />
      </html>
    )
  }

})

module.exports = Root

