
import React from 'react'

class Issues extends React.Component {

  render () {
    var href = 'https://github.com/jxnblk/writing/issues/new?title=' + this.props.title
    return (
      <div>
        <h4>Questions, Comments, Suggestions?</h4>
        <a href={href}
          className='bold'
          target='_blank'>
          Open an Issue
        </a>
      </div>
    )
  }

}

Issues.propTypes = {
  title: React.PropTypes.string
}

export default Issues

