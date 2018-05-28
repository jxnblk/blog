import React from 'react'
import Ax from 'axs'

const f = [
  10, 16, 18, 24, 36
]

const h1 = ({ ...props }) =>
  <Ax.h1
    {...props}
    css={`
      font-size: ${f[4]}px;
      margin-top: 2em;
      margin-bottom: 0.5em;
    `}
  />

const h2 = ({ ...props }) =>
  <Ax.h2
    {...props}
    css={`
      font-size: ${f[3]}px;
      margin-top: 2em;
      margin-bottom: 0.5em;
      color: tomato;
    `}
  />

const h3 = ({ ...props }) =>
  <Ax.h3
    {...props}
    css={`
      font-size: ${f[3]}px;
      margin-top: 2em;
      margin-bottom: 0.5em;
      color: tomato;
    `}
  />

export default {
  h1,
  h2,
  // h3,
  // h4,
  // h5,
  // h6,
  // p,
  // pre,
  // code,
  // blockquote,
  // ul,
  // li,
  // hr,
  // table,
  //
  // Container,
}
