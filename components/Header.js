
import React from 'react'

const Header = ({ title, description, ...props }) => (
  <header className='py3'>
    <a href='/'>Jxnblk / Writing</a>
    <h1>{title}</h1>
    <div className='sc'>{description}</div>
  </header>
)

export default Header

