
import React from 'react'

import basscss from 'basscss/css/basscss.min.css'
import base from '../css/base.css'

const Head = ({ title, post, keywords, author, ...props }) => {

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

    return (
      <head>
        <meta charSet='utf-8' />
        <title>{post ? (post.title + ' | ' + title) : title}</title>
        <meta name='description' content={description} />
        <meta name='author' content={author} />
        <meta name='keywords' content={tags.join()} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style dangerouslySetInnerHTML={{ __html: base }} />
        <style dangerouslySetInnerHTML={{ __html: basscss }} />
      </head>
    )
}

Head.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string,
  author: React.PropTypes.string
}

export default Head

