import path from 'path'

const req = require.context('.', false, /\.md$/)

const posts = req.keys()
  .filter(key => !/^\./.test(path.basename(key)))
  .map(key => {
    const name = path.basename(key, path.extname(key))
    const Component = req(key).default
    return {
      name,
      path: '/posts/' + name,
      Component,
      ...Component.defaultProps
    }
  })
  .filter(post => !post.draft)
  .sort((a, b) => a.created > b.created ? -1 : 1)

export default posts
