import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import Heading from './Heading'

const BasicLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
})

export default () =>
  <header>
    <Heading
      as='h1'
      fontSize={[ 5, 6 ]}
      mt={4}
      mb={5}>
      <BasicLink to='/'>
        Jxnblk Blog
      </BasicLink>
    </Heading>
  </header>
