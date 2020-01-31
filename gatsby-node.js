const fs = require('fs')
const util = require('util')
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
  const post = gm(src, {
    excerpt: file => {
      const [ first ] = file.content.split('\n\n')
      file.excerpt = first
    },
  })

  const compiler = remark()
    .use(remark.mdx)
    .use(remark.html)

  const html = await compiler.process(post.content)
  const excerpt = await compiler.process(post.excerpt)

  const next = Object.assign({}, page, {
    context: {
      ...page.context,
      html: html.contents,
      excerpt: excerpt.contents,
    }
  })
  actions.deletePage(page)
  actions.createPage(next)
}
