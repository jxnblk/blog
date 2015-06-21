
import React from 'react'
import { chunk as _chunk } from 'lodash'
import PostCard from './PostCard.jsx'
import PostDate from './PostDate.jsx'
import Pagination from './Pagination.jsx'

class Index extends React.Component {

  renderPost (post, i) {
    if (post.draft) { return false }
    return (
      <li key={'post-' + i} className='mb3'>
        <PostCard post={post} />
      </li>
    )
  }

  render () {
    var params = this.props.params || false
    var chunks = _chunk(this.props.posts, this.props.pageSize)
    var page
    var index = 0
    var posts 
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
    }
    posts = chunks[index]
    return (
      <div className='py3'>
        <ul className='list-reset'>
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

