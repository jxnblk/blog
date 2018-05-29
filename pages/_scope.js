import React from 'react'
// import Axs from 'axs'
import tag from 'clean-tag'
import styled from 'react-emotion'
import tags from 'html-tags'

const Ax = styled(tag)(props => props.css)
tags.forEach(t => {
  Ax[t] = props => <Ax is={t} {...props} />
})

const f = [
  10, 16, 18, 24, 36, 64
]

const BlockLink = props =>
  <Ax.a
    {...props}
    css={`
      display: block;
      text-decoration: none;
      color: inherit;
    `}
  />

const Heading = props =>
  <Ax.h2
    {...props}
    css={`
      font-size: ${f[4]}px;
      line-height: 1.25;
      margin-top: 2em;
      margin-bottom: 0.5em;
      ${props.css}
    `}
  />

const h1 = ({ id, ...props }) =>
  <BlockLink id={id} href={'#' + id}>
    <Heading
      {...props}
      is='h1'
      css={`
        font-size: ${f[4]}px;
        margin-top: 2em;
        margin-bottom: 1em;
        @media screen and (min-width: 48em) {
          font-size: ${f[5]}px;
        }
      `}
    />
  </BlockLink>

const h2 = ({ id, ...props }) =>
  <BlockLink id={id} href={'#' + id}>
    <Heading
      {...props}
      is='h2'
      css={`
        font-size: ${f[3]}px;
        margin-top: 2em;
        margin-bottom: 0.5em;
      `}
    />
  </BlockLink>

const h3 = ({ id, ...props }) =>
  <BlockLink id={id} href={'#' + id}>
    <Heading
      {...props}
      is='h3'
      css={`
        font-size: ${f[3]}px;
        line-height: 1.25;
        margin-top: 2em;
        margin-bottom: 0.5em;
      `}
    />
  </BlockLink>

const h4 = ({ id, ...props }) =>
  <BlockLink id={id} href={'#' + id}>
    <Heading
      {...props}
      is='h4'
      css={`
        font-size: ${f[2]}px;
        line-height: 1.25;
        margin-top: 2em;
        margin-bottom: 0.5em;
      `}
    />
  </BlockLink>

const a = props =>
  <Ax.a
    {...props}
    css={`
      color: inherit;
      &:hover {
        color: #07c;
      }
    `}
  />

const p = props =>
  <Ax.p
    {...props}
    css={`
      font-size: ${f[2]}px;
      margin-top: 0;
      margin-bottom: 2em;
    `}
  />

const blockquote = props =>
  <Ax.blockquote
    {...props}
    css={`
      font-size: ${f[3]};
      font-weight: bold;
      margin: 0;
      margin-top: 2em;
      margin-bottom: 2em;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 16px;
      padding-right: 16px;
      border-left: 4px solid;
    `}
  />

const ul = props =>
  <Ax.ul
    {...props}
    css={`
      font-size: ${f[2]}px;
      padding-left: 2em;
      margin-top: 2em;
      margin-bottom: 2em;
    `}
  />

const li = props =>
  <Ax.li
    {...props}
    css={`
    `}
  />

const pre = props =>
  <Ax.pre
    {...props}
    css={`
      font-family: Menlo, monospace;
      font-size: 87.5%;
      margin-top: 2em;
      margin-bottom: 2em;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 16px;
      padding-right: 16px;
      border-left: 4px solid;
      overflow-x: auto;
    `}
  />

const code = props =>
  <Ax.code
    {...props}
    css={`
      font-family: Menlo, monospace;
      font-size: 87.5%;
      border-bottom: 1px dashed;
    `}
  />

const hr = props =>
  <Ax.hr
    {...props}
    css={`
      margin-top: 4em;
      margin-bottom: 4em;
      border: 0;
      border-bottom: 2px solid black;
    `}
  />

const img = props =>
  <Ax.img
    {...props}
    css={`
      max-width: 100%;
      height: auto;
    `}
  />

const Overflow = props =>
  <Ax
    {...props}
    css={`
      overflow: auto;
    `}
  />

const table = props =>
  <Overflow>
    <Ax.table
      {...props}
      css={`
        width: 100%;
        max-width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 2em;
        margin-bottom: 2em;
        & th {
          border-bottom: 2px solid;
        }
        & td {
          border-bottom: 1px dashed;
        }
        & th, & td {
          text-align: left;
          padding-top: .25em;
          padding-bottom: .25em;
        }
      `}
    />
  </Overflow>

const Container = props =>
  <Ax
    {...props}
    css={`
      line-height: 1.625;
      min-width: 0;
      max-width: 768px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 4em;
      padding-left: 1em;
      padding-right: 1em;
    `}
  />

const Flex = props =>
  <Ax
    {...props}
    css={`
      display: flex;
    `}
  />

const Right = props =>
  <Ax
    {...props}
    css={`
      width: 0;
      @media screen and (min-width: 56em) {
        width: 320px;
      }
    `}
  />

export default {
  h1,
  h2,
  h3,
  h4,
  // h5,
  // h6,
  a,
  p,
  pre,
  code,
  blockquote,
  ul,
  li,
  hr,
  img,
  table,
  BlockLink,
  Heading,
  Container,
  Flex,
  Right,
}
