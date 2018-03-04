import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Link as RebassLink,
  Heading,
} from 'rebass'

const a = props => /^(http|\/\/)/.test(props.href)
  ? <RebassLink {...props} />
  : <RebassLink is={RouterLink} {...props} to={props.href} />

const h1 = props =>
  <Heading
    {...props}
    is='h1'
    fontSize={2}
  />

const h2 = props =>
  <Heading
    {...props}
    is='h2'
    fontSize={2}
  />

const code = props =>
  <pre {...props} />

export default {
  a,
  h1,
  h2,
  code,
}
