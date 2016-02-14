
import React from 'react'

class PostDate extends React.Component {

  render () {
    var date = new Date(this.props.date).toDateString()
    return (
      <div className='h6 bold caps compact'>
        {date}
      </div>
    )
  }

}

export default PostDate

