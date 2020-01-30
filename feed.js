module.exports = {
  query: `
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
          site_url: siteUrl
        }
      }
    }
  `,
  feeds: [
    {
      serialize: ({ query: { site, allSitePage } }) => {
        return allSitePage.nodes
          .map(page => ({
            ...page.context.frontmatter,
            description: page.context.frontmatter.excerpt,
            url: site.siteMetadata.siteUrl + page.path,
            guid: site.siteMetadata.siteUrl + page.path,
            custom_elements: [{
              "content:encoded": page.context.html
            }]
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
              html
              frontmatter {
                title
                date
                draft
                excerpt
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
