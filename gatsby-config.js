module.exports = {
  pathPrefix: '/blog',
  siteMetadata: {
    title: 'Jxnblog',
    description: 'The writing of Brent Jackson',
    siteUrl: 'https://jxnblk.com/blog'
  },
  __experimentalThemes: [
    {
      resolve: '@jxnblk/gatsby-theme-mdx-blog',
      options: {
        // render pages to root path
        name: '',
      }
    }
  ],
  plugins: [
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
