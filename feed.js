module.exports = {
  feeds: [
    {
      serialize: ({ query: { site, allPost } }) => {
        return allPost.edges
          .map(e => e.node)
          .filter(post => !post.draft)
          .map(post => ({
            ...post.frontmatter,
            description: post.excerpt,
            url: site.siteMetadata.siteUrl + post.slug,
            guid: site.siteMetadata.siteUrl + post.slug,
            custom_elements: [{ "content:encoded": post.html }]
        }))
      },
      query: `
      {
        site {
          siteMetadata {
            siteUrl
          }
        }
        allPost(
          limit: 1000,
          sort: {
            order: DESC,
            fields: date
          }
          filter: { draft: { ne: true } }
        ) {
          edges {
            node {
              title
              date
              slug
              excerpt
              html
            }
          }
        }
      }
    `,
      output: `rss.xml`
    }
  ]
}
