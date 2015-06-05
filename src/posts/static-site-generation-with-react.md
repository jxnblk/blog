---
title: Static Site Generation with React
created: 05-19-2015
draft: true
---

I've been dabbling with React for a few months now and love its composability and modularization.
The focus on reusablility, along with the ability to install and require componenets via npm,
shows a huge amount of potential for rapidly building application UI in a consistent way
and helping to mitigate some of the problems associated with working on larger projects.

To familiarize myself with React a little better, I've been using it on small open source projects
hosted on GitHub, and soon found myself wanting a way to build static sites.

## Why
React is incredibly intuitive and flexible to work with, but relying solely on client side rendering
leaves a lot to be desired in regards to percieved performance.
With a static React site, the page loads just like any other static HTML,
and the JavaScript kicks in whenever it’s downloaded.
This is extremely helpful for combining documentation with interactive demonstrations,
like Colorable or Building SVG Icons with React.

## How

First start a fresh project and initialize npm.

```bash
mkdir react-static-site
cd react-static-site
npm init
```

Although there are other modules to handle static site rendering, the following combination seems to work well.
I've tried a few different combinations of modules for a build system,
and I've landed on something that combines the following:
- React
- webpack
- webpack-dev-server
- jsx-loader (or babel-loader if ES6 is your thing)
- static-site-generator-webpack-plugin
- react-router

```bash
npm i --save-dev react webpack webpack-dev-server jsx-loader static-site-generator-webpack-plugin react-router
```

## 1. Set up Webpack

Webpack is a module bundler similar to Browserify, but can also replace Grunt and Gulp.
I'd heard great things about webpack, and they're mostly justified, but webpack's documentation is confusing and took me a while to get it up and running.

First off, you’ll need a `webpack.config.js` file.

```js
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
var data = require('./data')

module.exports = {
  entry: './entry.js',

  output: {
    filename: 'bundle.js',
    path: __dirname,
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('bundle.js', data.routes, data)
  ]
}
```

## 2. Create an Entry File
- react-router
- Routes.jsx

## 3. Create a Data File
- title
- description
- routes

## 4. Create Root.jsx

## 5. Package Scripts
- webpack-dev-server
- webpack
- webpack -p
- build

## 8. Adding Pages
- routes
- components
- route handlers

## 7. Adding Client-Size JS
- safeStringify
- initialProps script
- link to bundle.js
- entry (typeof document)

## 8. Other Enhancements
- Inline critical CSS with Basscss
- Image assets
- Fonts?


## Questions/Improvements
- Link component, baseHref, and gh-pages


---

```
## Why
- Percieved performance
- Enchancing a simple site
- Reusable components (your own or third party)
- Consolidated node based build system
- Data visualizations
- Client side routing
- Learning
- Fun

  Optional installs:
  - cssnext
  - basscss (or tachyons or suitcss)

```

