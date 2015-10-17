// Node script for cross-posting to medium.com

import fs from 'fs'
import path from 'path'
import medium from 'medium-sdk'
import frontMatter from 'front-matter'
import colors from 'colors'
import open from 'open'
import config from './config.json'

const { medium: { token: TOKEN } } = config
const args = process.argv.slice(2)
const slug = args[0]

const client = new medium.MediumClient({
  clientId: TOKEN,
  clientSecret: TOKEN
})

client.setAccessToken(TOKEN)

if (!args.length || typeof slug !== 'string') {
  throw new Error('Must specify a post to publish')
}

let src

try {
  src = fs.readFileSync(path.join(__dirname, 'src', 'posts', `${slug}.md`), 'utf8')
} catch (e) {
  throw new Error('Could not read file from /src/posts/' + args[0])
}

const matter = frontMatter(src)
const { title, tags } = matter.attributes
const canonicalUrl = `http://jxnblk.com/writing/posts/${slug}`

const content = `
# ${title}

${matter.body}

*Cross-posted from [jxnblk.com/writing](${canonicalUrl})*
`

client.getUser((err, user) => {
  if (err) {
    throw new Error(err)
  }

  console.log(`Authenticated as ${user.username}`.blue)
  client.createPost({
    userId: user.id,
    title,
    tags,
    content,
    canonicalUrl,
    contentFormat: 'markdown',
    publishStatus: 'draft'
  }, (err, post) => {
    if (err) {
      throw new Error(err)
    }

    console.log(
      `Draft post "${title}" published to Medium.com`.green,
      colors.blue(JSON.stringify(post, null, 2))
    )
    open(post.url)
  })
})

