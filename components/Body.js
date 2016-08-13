
import React from 'react'
import Header from './Header'
import Footer from './Footer'

class Body extends React.Component {

  render () {
    const { post, title, children } = this.props
    const date = post ? new Date(post.created).toDateString() : ''

    const view = React.cloneElement(children, this.props)

    return (
      <body className='measure mx-auto px2'>
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

