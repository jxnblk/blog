import React from 'react'
import { Link } from 'react-router-dom'
import UI from './_scope'

export default ({ render }) =>
  <UI.Flex>
    <UI.Container>
      <UI.BlockLink is={Link} to='/'>
        <UI.Heading
          is='h1'
          href='/'
          css={`
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: .2em;
            margin-top: 6em;
          `}
        >
          Jxnblk Writing
        </UI.Heading>
      </UI.BlockLink>
      {render()}
    </UI.Container>
    <UI.Right />
  </UI.Flex>
