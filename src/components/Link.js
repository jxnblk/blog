import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Link = styled.a`
  color: ${themeGet('colors.blue')};
  &:hover {
    color: ${themeGet('colors.magenta')};
  }
`

export default Link
