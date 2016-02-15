
import React from 'react'

class Issues extends React.Component {

  render () {
    var href = 'https://github.com/jxnblk/writing/issues/new?title=' + this.props.title
    return (
      <p>
        Questions, Comments, Suggestions?
        {' '}
        <a href={href} target='_blank'>
          Open an Issue
        </a>
      </p>
    )
  }

}

Issues.propTypes = {
  title: React.PropTypes.string
}

export default Issues

