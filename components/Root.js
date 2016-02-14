
import React from 'react'
import { find as _find } from 'lodash'
import Head from './Head'
import Body from './Body'

class Root extends React.Component {
  render () {
    const { posts, params } = this.props

    let post = false
    console.log('Root props', Object.keys(this.props), params)

    if (params && params.post) {
      const slug = params.post
      post = _find(posts, function(p) {
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

