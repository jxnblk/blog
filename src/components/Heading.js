import styled from 'styled-components'
import {
  space,
  fontSize,
  fontWeight,
  color,
} from 'styled-system'

const Heading = styled.h2({
  lineHeight: 1.125,
},
  space,
  fontSize,
  fontWeight,
  color
)

Heading.defaultProps = {
  fontSize: 4,
  fontWeight: 'bold',
  mt: 0,
  mb: 2,
}

export default Heading
