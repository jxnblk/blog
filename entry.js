
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Root from './components/Root'
import Index from './components/Index'
import Post from './components/Post'

module.exports = function render (locals, callback) {
  let view = false
  const params = {}

  if (locals.path.match(/^\/$|^\/page/)) {
    if (locals.path.match(/^\/page/)) {
      params.page = locals.path.replace(/^\/page\//, '')
    }
    view = <Index />
  } else if (locals.path.match(/^\/posts/)) {
    params.post = locals.path.replace(/^\/posts\//, '')
    view = <Post />
  } else {
    console.log('NO MATCHING PATH')
  }

  const html = renderToStaticMarkup(
    <Root {...locals}
      params={params}
      children={view} />
  )

  callback(null, `<!DOCTYPE html>${html}`)
}

