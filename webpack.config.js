
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          'babel-loader',
          '@compositor/md-loader'
        ]
      }
    ]
  }
}
