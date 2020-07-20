module.exports = {
  siteMetadata: {
    title: 'Jxnblk',
    description: 'Brent Jackson',
    siteUrl: 'https://jxnblk.com'
  },
  plugins: [{
    resolve: 'gatsby-plugin-mdx',
    options: {
      extensions: ['.mdx', '.md']
    }
  }, {
    resolve: 'gatsby-plugin-theme-ui',
    options: {
      prismPreset: 'nightOwl'
    }
  }, 'gatsby-plugin-react-helmet', 'gatsby-plugin-catch-links', 'gatsby-plugin-twitter', {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-4603832-6'
    }
  }]
};