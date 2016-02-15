
import React from 'react'
import Head from './Head'
import Body from './Body'

class Root extends React.Component {
  render () {
    const { posts, params } = this.props

    let post = false

    if (params && params.post) {
      const slug = params.post
      post = posts.find(p => (p.slug === slug))
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

