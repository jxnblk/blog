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
        allSitePage(
          sort: {
            fields: context___frontmatter___date,
            order: DESC
          }
          filter: {
            path: {
              glob: "/blog/*"
            },
            context: {
              frontmatter: {
                draft: {
                  ne: true
                }
              }
            }
          }
        ) {
          nodes {
            path
            context {
              frontmatter {
                title
                date
                draft
              }
            }
          }
        }
      }
    `,
      output: `rss.xml`
    }
  ]
}
