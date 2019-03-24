// const mdxFeed = require('gatsby-mdx/feed')
const feedOptions = {
  feeds: [
    {
      serialize: ({ query: { site, allMdx } }) => {
        return allMdx.edges
          .filter(({ node }) => !node.frontmatter.draft)
          .map(edge => {
          return {
            ...edge.node.frontmatter,
            description: edge.node.excerpt,
            url: site.siteMetadata.siteUrl + edge.node.fields.slug,
            guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
            custom_elements: [{ "content:encoded": edge.node.html }]
          }
        })
      },
      query: `
      {
        allMdx(
          limit: 1000,
          sort: {
            order: DESC,
            fields: [frontmatter___date]
          }
          filter: { frontmatter: { draft: { ne: true } } }
        ) {
          edges {
            node {
              frontmatter {
                title
                date
              }
              fields {
                slug
              }
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

module.exports = {
  pathPrefix: '/blog',
  siteMetadata: {
    title: 'Jxnblog',
    description: 'The writing of Brent Jackson',
    siteUrl: 'https://jxnblk.com/blog'
  },
  plugins: [
    {
      resolve: 'gatsby-mdx',
      options: {
        extensions: [ '.mdx', '.md' ],
        defaultLayouts: { default: require.resolve('./src/layouts/post.js') }
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: feedOptions
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Roboto Mono'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-4603832-6'
      }
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-layout',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: __dirname + '/src/pages'
      }
    },
  ]
}
