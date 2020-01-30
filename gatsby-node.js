const fs = require('fs')
const util = require('util')
// const mdx = require('@mdx-js/mdx')
// const React = require('react')
// const { renderToString } = require('react-dom/server')
const gm = require('gray-matter')

const remark = require('remark')

remark.mdx = require('remark-mdx')
remark.html = require('remark-html')

const readFile = util.promisify(fs.readFile)

exports.onCreatePage = async ({
  page,
  actions
}) => {
  if (!page.context.frontmatter || !/^\/blog\//.test(page.path)) return

  const src = await readFile(page.component, 'utf8')
  const { content, excerpt, data } = gm(src, {
    excerpt: file => {
      const [ first ] = file.content.split('\n\n')
      console.log({ first })
      file.excerpt = first
    },
    // excerpt_separator: '<!---->',
  })

  const compiler = remark()
    .use(remark.mdx)
    .use(remark.html)

  const html = await compiler.process(content)

  const next = Object.assign({}, page, {
    context: {
      ...page.context,
      html: html.contents,
      excerpt,
    }
  })
  actions.deletePage(page)
  actions.createPage(next)
}
