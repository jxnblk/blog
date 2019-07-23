/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import Post from '@jxnblk/gatsby-theme-mdx-blog/src/layouts/post'
import { TwitterShareButton } from 'react-share'

export default props => console.log(props) ||
  <Post {...props}>
    {props.children}
    <div>
      <TwitterShareButton
        url={`https://jxnblk.com/blog${props.path}`}
        title={props.title}
        via='jxnblk'
        sx={{
          display: 'inline-block',
          px: 3,
          py: 2,
          fontWeight: 'bold',
          borderRadius: 4,
          color: 'white',
          bg: 'primary',
        }}>
        Tweet
      </TwitterShareButton>
    </div>
  </Post>
