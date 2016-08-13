
import React from 'react'

const Header = ({ title, description, ...props }) => (
  <header>
    <h1>
      <a href='/writing'>Jxnblk Writing</a>
    </h1>
    <h2 className='f1'>{title}</h2>
    <div className='sc'>{description}</div>
  </header>
)

export default Header

