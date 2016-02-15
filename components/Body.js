
import React from 'react'
import { RouteHandler } from 'react-router'
// import { Header, Footer } from 'blk'
import Header from './Header'
import Footer from './Footer'
import PostTitle from './PostTitle'

class Body extends React.Component {

  render () {
    const { post, title, children } = this.props
    const date = post ? new Date(post.created).toDateString() : null

    const view = React.cloneElement(children, this.props)

    return (
      <body className='max-width-3 mx-auto px3'>
        <Header {...this.props}
          title={post.title}
          description={date} />
        {view}
        <Footer {...this.props} />
        <script dangerouslySetInnerHTML={{ __html: this.props.gaScript }} />
      </body>
    )
  }

}

export default Body

