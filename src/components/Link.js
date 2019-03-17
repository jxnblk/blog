import React from 'react'
import styled from 'styled-components'
import { space, themeGet } from 'styled-system'

const Link = styled.a`
  color: ${themeGet('colors.blue')};
  &:hover {
    color: ${themeGet('colors.magenta')};
  }
  ${space}
`

export default props => {
  if (props.className === 'footnote-backref') {
    return (
      <Link
        {...props}
        title='Back to article'
        style={{ textDecoration: 'none' }}
        mx={2}>
        [^]
      </Link>
    )
  }
  return <Link {...props} />
}
