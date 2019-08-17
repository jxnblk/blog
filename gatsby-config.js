module.exports = {
  siteMetadata: {
    title: 'Jxnblk',
    description: 'Brent Jackson',
    siteUrl: 'https://jxnblk.com'
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-theme-jxnblk',
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
  ]
}
