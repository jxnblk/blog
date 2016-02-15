
import React from 'react'

class Data extends React.Component {

  getChildContext () {
    return {
      data: this.props.data
    }
  }

  render () {
    return this.props.children
  }
}

Data.childContextTypes = {
  data: React.PropTypes.object.isRequired
}

export default Data

