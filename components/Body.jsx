
import React from 'react'
import { RouteHandler } from 'react-router'
import { Header, Footer } from 'blk'
import PostTitle from './PostTitle.jsx'

class Body extends React.Component {

  render () {
    let postTitle = this.props.title
    let breadcrumbs = []
    if (this.props.post) {
      postTitle = <PostTitle post={this.props.post} />
      breadcrumbs = [{
        href: this.props.baseUrl,
        text: this.props.title
      }]
    }
    return (
      <body className='container px2'>
        <Header {...this.props}
          breadcrumbs={breadcrumbs}
          description={false}
          title={postTitle} />
        <RouteHandler {...this.props} />
        <Footer {...this.props} />
        <script dangerouslySetInnerHTML={{ __html: this.props.gaScript }} />
      </body>
    )
  }

}

export default Body

