
import React from 'react'
import { find as _find } from 'lodash'
import Head from './Head.jsx'
import Body from './Body.jsx'

class Root extends React.Component {

  render () {
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

}

export default Root

