
import React from 'react'
import { RouteHandler } from 'react-router'
// import { Header, Footer } from 'blk'
import PostTitle from './PostTitle'

class Body extends React.Component {

  render () {
    const { post, title, children } = this.props

    console.log('Body post', Object.keys(post))

    let breadcrumbs = []
    let postTitle
    if (post) {
      postTitle = <PostTitle post={post} />
      breadcrumbs = [{
        href: this.props.baseUrl,
        text: this.props.title
      }]
    }

    const view = React.cloneElement(children, { ...this.props, breadcrumbs, title })

    return (
      <body className='container px2'>
        {view}
        {/*
        <Header {...this.props}
          breadcrumbs={breadcrumbs}
          description={false}
          title={title} />
        */}
        {/*
        <RouteHandler {...this.props} />
        <Footer {...this.props} />
        */}
        <script dangerouslySetInnerHTML={{ __html: this.props.gaScript }} />
      </body>
    )
  }

}

export default Body

