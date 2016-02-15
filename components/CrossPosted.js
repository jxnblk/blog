
import React from 'react'

class CrossPosted extends React.Component {

  renderLink (href, i) {
    return <li key={i}><a href={href} className='break-word'>{href}</a></li>
  }

  render () {
    if (!this.props.links) { return false }
    return (
      <div className='mt3 mb3'>
        <p className='sc m0'>Cross posted at</p>
        <ul className='list-reset m0'>
          {this.props.links.map(this.renderLink)}
        </ul>
      </div>
    )
  }

}

CrossPosted.propTypes = {
  links: React.PropTypes.array
}


module.exports = CrossPosted

