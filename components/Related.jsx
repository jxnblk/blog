
var React = require('react')

var Related = React.createClass({

  propTypes: {
    links: React.PropTypes.array
  },

  renderLink: function (link, i) {
    return <li key={i}><a href={link.href} className='break-word'>{link.name}</a></li>
  },

  render: function () {
    if (!this.props.links) { return false }
    return (
      <div className='mt3 mb3 py3 border-top border-bottom'>
        <h4 className='m0'>Related</h4>
        <ul className='list-reset m0'>
          {this.props.links.map(this.renderLink)}
        </ul>
      </div>
    )
  }

})

module.exports = Related

