
import React from 'react'
import { chunk } from 'lodash'
import PostCard from './PostCard'
import Pagination from './Pagination'

class Index extends React.Component {

  renderPost (post, i) {
    return (
      <li key={'post-' + i} className='mb3'>
        <PostCard post={post} />
      </li>
    )
  }

  render () {
    const publishedPosts = this.props.posts.filter(p => !p.draft)
    var params = this.props.params || false
    var chunks = chunk(publishedPosts, this.props.pageSize)
    var page
    var index = 0
    var posts = []
    var previous = false
    var next = false
    if (params && params.page) {
      page = parseInt(params.page, 10)
      index = params.page - 1
      if (chunks[index - 1]) {
        previous = page - 1
      }
      if (chunks[index + 1]) {
        next = page + 1
      }
    } else if (publishedPosts.length > this.props.pageSize) {
      next = 2
    }
    posts = chunks[index]
    return (
      <div>
        <ul style={{
            listStyle: 'none',
            paddingLeft: 0
          }}>
          {posts.map(this.renderPost)}
        </ul>
        <Pagination {...this.props}
          index={index}
          previous={previous}
          next={next} />
      </div>
    )
  }

}

Index.propTypes = {
  posts: React.PropTypes.array
}

export default Index

