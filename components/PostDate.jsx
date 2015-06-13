
var React = require('react')

var PostDate = React.createClass({

  render: function() {
    var date = new Date(this.props.date).toDateString()
    return (
      <span className='h6 bold caps compact'>
        {date}
      </span>
    )
  }

})

module.exports = PostDate

