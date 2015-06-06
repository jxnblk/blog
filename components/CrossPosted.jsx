
var React = require('react')

var CrossPosted = React.createClass({

  propTypes: {
    links: React.PropTypes.array
  },

  renderLink: function (href, i) {
    return <li key={i}><a href={href} className='break-word'>{href}</a></li>
  },

  render: function () {
    if (!this.props.links) { return false }
    return (
      <div className='mt3 mb3 py3 border-top border-bottom'>
        <p className='m0'>Cross posted at</p>
        <ul className='list-reset'>
          {this.props.links.map(this.renderLink)}
        </ul>
      </div>
    )
  }

})

module.exports = CrossPosted

