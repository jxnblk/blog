import React from 'react'
import posts from '../posts'
import UI from './_scope'

const routes = posts.map(({ path }) => ({ path }))

const defaultMeta = {
  'description': 'The writing of Brent Jackson',
  'twitter:card': 'summary',
  'twitter:site': '@jxnblk',
  'twitter:image': 'https://jxnblk.com/avatar.png',
  'twitter:title': 'Jxnblk Writing',
  'twitter:description': 'The writing of Brent Jackson',
}
const getMeta = obj => {
  const merged = { ...defaultMeta, ...obj }
  return Object.keys(merged).map(key => ({
    name: key,
    content: merged[key]
  }))
}

export default class Post extends React.Component {
  static getInitialProps = async ({ path }) => {
    const post = posts.find(post => post.path === path)
    const {
      title,
      excerpt
    } = post || {}
    const meta = title ? getMeta({
      'twitter:title': title,
      'twitter:description': excerpt
    }) : undefined
    return {
      path: '/posts/:name',
      routes,
      title,
      meta
    }
  }
  render () {
    const { name } = this.props.match.params

    const post = posts.find(post => post.name === name)

    if (!name || !post) return <pre>Not found</pre>

    const { title, Component } = post

    return (
      <div>
        <UI.h1>{title}</UI.h1>
        <pre>{post.created.toDateString()}</pre>
        <Component
          scope={UI}
        />
      </div>
    )
  }
}
