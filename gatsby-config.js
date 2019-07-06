module.exports = {
  pathPrefix: '/blog',
  siteMetadata: {
    title: 'Jxnblog',
    description: 'The writing of Brent Jackson',
    siteUrl: 'https://jxnblk.com/blog'
  },
  plugins: [
    '@jxnblk/gatsby-theme-mdx-blog',
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
  ]
}
