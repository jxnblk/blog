var React = require('react')

var Square = React.createClass({

  getDefaultProps: function() {
    return {
      size: 64,
      fill: 'currentcolor'
    }
  },

  render: function() {

    var size = this.props.size

    var fill = this.props.fill
    var viewBox = [0, 0, size, size].join(' ')

    // Prevent scientific notation when converting
    // small numbers to string
    var num = function(n) {
      return (n < 0.0000001) ? 0 : n
    }

    var pathData = [
      'M', 2, 2, // Move to 2,2
      'L', 62, 2, // Draw a line to 62,2
      'L', 62, 62, // Draw a line to 62,62
      'L', 2, 62, // Draw a line to 2,62
      'L', 2, 2, // Draw a line to 2,2
    ].join(' ')

    return (
      <svg
        xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}
        width={size}
        height={size}
        fill={fill}>
        <path d={pathData} />
      </svg>
    )

  }

})

module.exports = Square

