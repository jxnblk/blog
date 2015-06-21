
import React from 'react'
import { RouteHandler } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

class Body extends React.Component {

  render () {
    return (
      <body className='container px2'>
        <Header {...this.props} />
        <RouteHandler {...this.props} />
        <Footer {...this.props} />
        <script dangerouslySetInnerHTML={{ __html: this.props.gaScript }} />
      </body>
    )
  }

}

export default Body

