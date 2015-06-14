
var React = require('react')

var PostDate = React.createClass({

  render: function() {
    var date = new Date(this.props.date).toDateString()
    return (
      <div className='h6 bold caps compact'>
        {date}
      </div>
    )
  }

})

module.exports = PostDate

