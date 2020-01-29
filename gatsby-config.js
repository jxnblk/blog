module.exports = {
  siteMetadata: {
    title: 'Jxnblk',
    description: 'Brent Jackson',
    siteUrl: 'https://jxnblk.com'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [
          '.mdx', '.md',
        ],
      }
    },
    'gatsby-plugin-theme-ui',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Roboto Mono'
        ]
      }
    },
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-4603832-6'
      }
    },
    // {
    //   resolve: 'gatsby-plugin-feed',
    //   options: require('./feed')
    // },
  ]
}
