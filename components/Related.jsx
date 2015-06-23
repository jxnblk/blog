
import React from 'react'

class Related extends React.Component {

  renderLink (link, i) {
    return <li key={i}><a href={link.href} className='break-word'>{link.name}</a></li>
  }

  render () {
    if (!this.props.links) { return false }
    return (
      <div className='py3'>
        <h4 className='m0'>Related</h4>
        <ul className='list-reset m0'>
          {this.props.links.map(this.renderLink)}
        </ul>
      </div>
    )
  }

}

Related.propTypes = {
  links: React.PropTypes.array
}

export default Related

