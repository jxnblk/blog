
import React from 'react'

class Pagination extends React.Component {

  render () {
    var previous
    var next
    // console.log('prev/next', this.props.index, this.props.previous, this.props.next)
    if (typeof this.props.previous === 'number') {
      previous = (
        <a href={this.props.baseUrl + 'page/' + this.props.previous}
          className='left'>
          Previous
        </a>
      )
    }
    if (typeof this.props.next === 'number') {
      next = (
        <a href={this.props.baseUrl + 'page/' + this.props.next}
          className='right'>
          Next
        </a>
      )
    }

    return (
      <div className='clearfix'>
        {previous}
        {next}
      </div>
    )
  }

}

Pagination.defaultProps = {
  next: false,
  previous: false
}

export default Pagination

