
var React = require('react')

var Pagination = React.createClass({

  getDefaultProps: function() {
    return {
      next: false,
      previous: false
    }
  },

  render: function() {
    var previous
    var next
    console.log('prev/next', this.props.index, this.props.previous, this.props.next)
    if (typeof this.props.previous === 'number') {
      previous = (
        <a href={this.props.baseUrl + 'page/' + this.props.previous}
          className='left bold'>
          Previous
        </a>
      )
    }
    if (typeof this.props.next === 'number') {
      next = (
        <a href={this.props.baseUrl + 'page/' + this.props.next}
          className='right bold'>
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

})

module.exports = Pagination

