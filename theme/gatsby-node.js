const fs = require(`fs`)
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const get = require('lodash.get')

const join = (...args) => args.filter(Boolean).join('/')

const mdxResolverPassthrough = fieldName => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType(`Mdx`)
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  })
  const resolver = type.getFields()[fieldName].resolve
  const result = await resolver(mdxNode, args, context, {
    fieldName,
  })
  return result
}

const resolveTitle = async (...args) => {
  const headings = await mdxResolverPassthrough('headings')(...args)
  return get(headings, '0.value', '')
}

exports.sourceNodes = ({ actions, schema }) => {
  actions.createTypes(
    schema.buildObjectType({
      name: 'Post',
      fields: {
        id: { type: 'ID!' },
        title: {
          type: 'String!',
        },
        slug: {
          type: 'String!',
        },
        date: {
          type: 'Date',
          extensions: { dateformat: {} }
        },
        draft: {
          type: 'Boolean',
        },
        tags: {
          type: '[String]!',
        },
        excerpt: {
          type: 'String!',
          args: {
            pruneLength: {
              type: `Int`,
              defaultValue: 256,
            },
          },
          resolve: mdxResolverPassthrough('excerpt'),
        },
        body: {
          type: 'String!',
          resolve: mdxResolverPassthrough('body'),
        },
        html: {
          type: 'String!',
          resolve: mdxResolverPassthrough('html'),
        }
      },
      interfaces: ['Node'],
    })
  )
}

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type !== `Mdx`) return

  const parent = getNode(node.parent)
  const child = getNode(node.id)
  if (parent.sourceInstanceName !== 'posts') return

  const slug = '/blog' + createFilePath({
    node,
    getNode,
  })

  const title = get(node, 'headings[1].value',
    get(node, 'frontmatter.title', '')
  )
  const date = get(node, 'frontmatter.date')
  const draft = get(node, 'frontmatter.draft', false)
  const tags = get(node, 'frontmatter.tags', [])

  actions.createNode({
    slug,
    title,
    date,
    draft,
    tags,
    id: createNodeId(`${node.id} >>> Post`),
    parent: node.id,
    children: [],
    internal: {
      type: `Post`,
      contentDigest: createContentDigest({
        slug,
        date,
        body: node.rawBody,
      }),
      content: node.rawBody,
      description: `Blog Posts`,
    },
  })

  actions.createParentChildLink({ parent, child })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
    {
      allPost(
        sort: {
          fields: [date, title],
          order: DESC
        }
        limit: 1000
      ) {
        edges {
          node {
            id
            slug
            title
            date
          }
        }
      }
    }
  `)

  if (result.errors) reporter.panic(result.errors)

  const filtered = await graphql(`
    {
      allPost(
        sort: {
          fields: [date, title],
          order: DESC
        }
        filter: {
          draft: { ne: true }
        }
        limit: 1000
      ) {
        edges {
          node {
            id
            slug
            title
            date
          }
        }
      }
    }
  `)

  if (filtered.errors) reporter.panic(filtered.errors)

  const posts = result.data.allPost.edges.map(e => e.node)
  const list = result.data.allPost.edges.map(e => e.node)

  posts.forEach(post => {
    actions.createPage({
      path: post.slug,
      component: require.resolve('./src/templates/post.js'),
      context: {
        id: post.id,
      },
    })
  })

  const limit = 16
  const pages = Math.ceil(list.length / limit)

  Array.from({ length: pages }).forEach((n, i) => {
    const pi = i
    const ni = i + 2
    let previous = ''
    let next = ''
    if (i > 0) {
      previous = pi === 1 ? '/blog' : join('/blog', pi)
    }
    if (ni < pages) {
      next = join('/blog', ni)
    }
    const slug = i === 0 ? '/blog' : join('/blog', i + 1)

    actions.createPage({
      path: slug,
      component: require.resolve('./src/templates/posts.js'),
      context: {
        previous,
        next,
        limit,
        skip: i * limit,
      }
    })
  })
}

