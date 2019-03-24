const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== 'Mdx') return

  const value = createFilePath({ node, getNode })
  actions.createNodeField({
    name: 'slug',
    node,
    value,
  })
}

exports.createPages = ({
  graphql,
  actions,
}) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
              filter: { frontmatter: { draft: { ne: true } } }
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        const posts = result.data.allMdx.edges
        const limit = 12
        const length = Math.ceil(posts.length / limit)
        Array.from({ length }).forEach((_, i) => {
          const previousIndex = i
          const nextIndex = i + 2
          const previous = i > 0 && (previousIndex === 1 ? '/' : `/page/${previousIndex}`)
          const next = nextIndex <= length && `/page/${nextIndex}`
          actions.createPage({
            path: i === 0 ? '/' : `/page/${i + 1}`,
            component: path.resolve('./src/templates/index.js'),
            context: {
              previous,
              next,
              limit,
              skip: i * limit,
            },
          })
        })
      })
    )
  })
}
