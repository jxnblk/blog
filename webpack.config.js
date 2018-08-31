module.exports = {
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        exclude: /node_modules/,
        use: 'mdx-fm-loader'
      }
    ]
  }
}
