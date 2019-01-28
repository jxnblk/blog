// const mdxFeed = require('gatsby-mdx/feed')

module.exports = {
  siteMetadata: {
    title: 'Jxnblk Blog',
    description: 'The writing of Brent Jackson',
    siteUrl: 'https://jxnblk.com/blog'
  },
  plugins: [
    // { resolve: 'gatsby-plugin-feed', options: mdxFeed },
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
    {
      resolve: 'gatsby-mdx',
      options: {
        extensions: [ '.mdx', '.md' ],
        defaultLayouts: { default: require.resolve('./src/layouts/post.js') }
      }
    }
  ]
}
