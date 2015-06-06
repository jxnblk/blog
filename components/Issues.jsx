
var React = require('react')

var Issues = React.createClass({

  propTypes: {
    title: React.PropTypes.string
  },

  render: function () {
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

})

module.exports = Issues
