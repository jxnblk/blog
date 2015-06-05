---
title: Static Site Generation with React
created: 05-19-2015
draft: true
---

I've been dabbling with React for a few months now and using it in several small open source projects
to better understand the technology.
React’s focus on reusablility, along with the ability to install and require components via npm,
provides an elegant way to rapidly build application UI in an efficient and consistent way.
It's also a great way to handle server-side rendering and provides high cohesion between markup and display logic.

## Why

React is incredibly intuitive and flexible to work with,
but relying solely on client side rendering
leaves a lot to be desired in regards to percieved performance.
With a static React site, the page loads just like any other static HTML,
and the JavaScript kicks in whenever it’s downloaded.
This is extremely helpful for combining documentation with interactive demonstrations,
like [Colorable](http://jxnblk.com/colorable) or [Building SVG Icons with React](http://jxnblk.com/react-icons).

## How

Although there are several ways to render static sites with React,
the following is what I've found to be easiest.

First start a fresh project and initialize npm.

```bash
mkdir react-static-site
cd react-static-site
npm init
```

Install the following modules.

```bash
npm i --save-dev react webpack webpack-dev-server jsx-loader static-site-generator-webpack-plugin react-router
```

If you prefer using ES6, install `babel-loader` instead of `jsx-loader`.

## Set up Webpack

Webpack is a module bundler similar to Browserify, but can also replace front-end build systems like Grunt and Gulp.

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
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('bundle.js', data.routes, data)
  ]
}
```

## Create an Entry File

The entry file is what webpack will read to build the bundle, and that is what the static-site-generator-webpack-plugin will use to generate HTML.

For a single rendered page, you can skip react-router and create an `entry.js` file like the following.

```js
// entry.js with no routing
var React = require('react')
var Root = require('./components/Root.jsx')

module.exports = function render(locals, callback) {
  var html = React.renderToStaticMarkup(React.createElement(Root, locals))
  callback(null, '<!DOCTYPE html>'+html)
};
```

For handling multiple routes, update the entry file using react-router and create a `Routes.jsx` file.

```js
// entry.js
var React = require('react')
var Router = require('react-router')
var Routes = require('./Routes.jsx')

module.exports = function render(locals, callback) {
  Router.run(Routes, locals.path, function(Handler) {
    var html = React.renderToStaticMarkup(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>'+html)
  })
}
```

```js
// Routes.jsx
var React = require('react')
var Router = require('react-router')
var Route = Router.Route
var DefaultRoute = Router.DefaultRoute
var Root = require('./components/Root.jsx')
var Index = require('./components/Index.jsx')

var Routes = (
  <Route handler={Root} path="/">
    <DefaultRoute handler={Index} />
  </Route>
);

module.exports = Routes
```

## Create a Data File

Next create a `data.js` file that will include initial props passed to the Root component and routes used for the router.

```js
module.exports = {
  title: 'My Static Site',
  routes: [
    '/'
  ]
}
```

## Create Root.jsx

The Root component will include the `<html>` element, `<head>` and other code that will be shared across all pages.
The `<RouteHandler>` component will, as its name states, handle the different routes.
To keep things somewhat organized, create this file in a `components` directory.

```js
// components/Root.jsx
var React = require('react')
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Root = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          <RouteHandler {...this.props} />
        </body>
      </html>
    )
  }
})

module.exports = Root
```

## Create Index.jsx

The Index component will be the page rendered with `<DefaultRoute>` and should contain the content for the root `index.html` file.

```js
var React = require('react')

var Index = React.createClass({
  render: function() {
    return (
      <main>
        Index component
      </main>
    )
  }
})

module.exports = Index
```

## Package Scripts

Add the following scripts to `package.json` to run webpack.

```json
"scripts": {
  "webpack": "webpack --progress --colors",
  "dev": "webpack-dev-server --progress --colors",
  "start": "npm run dev"
}
```

```bash
npm start
```

Open <http://localhost:8080>

## Adding Pages
- routes
- components
- route handlers

## Adding Client-Size JS
- safeStringify
- initialProps script
- link to bundle.js
- entry (typeof document)

---

## Other Enhancements
- Inline critical CSS with Basscss
- Image assets
- Fonts?


## Questions/Improvements
- Link component, baseHref, and gh-pages


---

```
React provides an elegant way to build UI in a consistent and easy to understand way.
Shows potential for helping solve some of the design problems that arise when building applications at scale.
tight coupling between the markup and display logic used for displaying information.
It encourages reusability and has a growing ecosystem
with a plethora of components to help reduce the amount of work needed to build applications in a more efficient way.
```

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

