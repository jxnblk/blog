// RSS generator
const fs = require('fs')
const RSS = require('rss')
const data = require('./data')

const {
  title,
  description,
  author,
} = data

const options = {
  title,
  description,
  site_url: 'http://jxnblk.com/writing',
  image_url: 'http://jxnblk.com/avatar/avatar-640.png'
}

const feed = new RSS(options)

console.log('Generating RSS feed for ', data.posts.length)

data.posts.forEach(post => {
  feed.item({
    title: post.title,
    description: post.excerpt,
    date: post.created,
    url: `http://jxnblk.com/writing/posts/${post.slug}`,
    guid: post.slug,
    categories: post.tags,
    author
  })
})

const xml = feed.xml()

fs.writeFileSync('rss.xml', xml)

