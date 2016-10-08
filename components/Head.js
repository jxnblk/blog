
import React from 'react'

import bassLayout from 'basscss-layout/css/layout.css'
import bassMargin from 'basscss-margin/css/margin.css'
import bassPadding from 'basscss-padding/css/padding.css'
import base from '../css/base.css'

const twitterCard = ({
  author = '@jxnblk',
  card = 'summary',
  title = 'http://jxnblk.com/avatar/avatar-640.png',
  description,
  image
}) => {
  return [
    <meta name='twitter:card' content={card} />,
    <meta name='twitter:creator' content={author} />,
    <meta name='twitter:title' content={title} />,
    <meta name='twitter:description' content={description} />,
    <meta name='twitter:image' content={image} />
  ]
}

const Head = ({
  title,
  post,
  keywords,
  author,
  ...props
}) => {
  const { meta = {} } = post

  let tags = keywords
  let description
  if (post && post.tags) {
    tags = keywords.concat(post.tags)
  }

  if (post && post.excerpt) {
    description = post.excerpt
  } else {
    description = props.description
  }

  const image = meta.image || 'http://jxnblk.com/avatar/avatar-640.png'

  return (
    <head>
      <meta charSet='utf-8' />
      <title>{post ? (post.title + ' | ' + title) : title}</title>
      <meta name='description' content={description} />
      <meta name='author' content={author} />
      <meta name='keywords' content={tags.join()} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {twitterCard({
        title: post ? post.title : title,
        description,
        image
      })}
      <style dangerouslySetInnerHTML={{ __html: base }} />
      <style dangerouslySetInnerHTML={{ __html: bassLayout }} />
      <style dangerouslySetInnerHTML={{ __html: bassMargin }} />
      <style dangerouslySetInnerHTML={{ __html: bassPadding }} />
      <link href='https://fonts.googleapis.com/css?family=Roboto+Mono:400' rel='stylesheet' />
    </head>
  )
}

Head.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string,
  author: React.PropTypes.string
}

export default Head

