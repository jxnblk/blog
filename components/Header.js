
import React from 'react'

const Header = ({ title, description, ...props }) => (
  <header className='py2'>
    <h1 className='f2'>
      <a href='/'>Jxnblk / Writing</a>
    </h1>
    <h2 className='f1'>{title}</h2>
    <div className='sc'>{description}</div>
  </header>
)

export default Header

