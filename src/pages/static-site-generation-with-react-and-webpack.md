---
title: Static Site Generation with React and Webpack
date: 2015-06-06
tags:
  - react
  - webpack
  - static-site
  - tutorial
related:
  - name: Building SVG Icons with React
    href: http://jxnblk.com/react-icons
  - name: React Static Site by Brad Denver
    href: http://braddenver.com/blog/2015/react-static-site.html
  - name: Antwar
    href: http://antwarjs.github.io/
---

# Static Site Generation with React and Webpack

I’ve been dabbling with React for a few months now and using it in several small open source projects
to better understand the technology.
React’s focus on reusablility, along with the ability to install and require components via npm,
provides an elegant way to rapidly build application UI in an efficient and consistent way.
It’s also a great way to handle server-side rendering and provides high cohesion between markup and display logic.

**Note: many of the packages referenced in this post have released major version, breaking updates since this was written. Some of the examples may not work with the latest npm modules, especially the react-router package, which has a much different API now.**

## Why

React is incredibly intuitive and flexible to work with,
but relying solely on client side rendering
leaves a lot to be desired in regards to percieved performance.
With a static React site, the page loads just like any other static HTML,
and the JavaScript kicks in whenever it’s downloaded.
This is extremely helpful for combining documentation with interactive demonstrations,
like [Colorable](http://jxnblk.com/colorable) or [Building SVG Icons with React](http://jxnblk.com/react-icons).
Using React with webpack also allows you to consolidate the entire build process
in Node and take advantage of anything in the npm ecosystem.
Last but not least, React is just fun to use.

## How

Although there are several ways to render static sites with React,
the following is what I’ve found to be easiest.

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

<a href="http://webpack.github.io/" target="_blank">Webpack</a> and webpack-dev-server will be used for the entire build process and can also handle assets such as CSS, images, and fonts.
The jsx-loader is used to transpile imported jsx files. If you prefer ES6, you can use babel-loader instead of jsx-loader.
The <a href="https://github.com/markdalgleish/static-site-generator-webpack-plugin" target="_blank">static-site-generator-webpack-plugin</a> module is what is used to generate static HTML.
And <a href="http://rackt.github.io/react-router/" target="_blank">React Router</a> is used to handle routing. For single page static sites, React Router is not needed.

## Set up Webpack

Webpack is a module bundler similar to Browserify, but can also replace front-end build systems like Grunt and Gulp.

First off, you’ll need a `webpack.config.js` file. The webpack command line interface will use this config file.

```js
// webpack.config.js
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

The entry file is what webpack will read to build `bundle.js`,
and the static-site-generator-webpack-plugin uses the bundle to generate HTML.

For a single rendered page, you can skip React Router and create an `entry.js` file like the following.

```js
// entry.js with no routing
var React = require('react')
var Root = require('./components/Root.jsx')

module.exports = function render(locals, callback) {
  var html = React.renderToStaticMarkup(React.createElement(Root, locals))
  callback(null, '<!DOCTYPE html>' + html)
}
```

For handling multiple routes, update the entry file using React Router and create a `Routes.jsx` file.

```js
// entry.js
var React = require('react')
var Router = require('react-router')
var Routes = require('./Routes.jsx')

module.exports = function render(locals, callback) {
  Router.run(Routes, locals.path, function (Handler) {
    var html = React.renderToStaticMarkup(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>' + html)
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
  <Route handler={Root} path='/'>
    <DefaultRoute handler={Index} />
  </Route>
)

module.exports = Routes
```

## Create a Data File

Next create a `data.js` file that will include initial props passed to the Root component and routes used for the router.

```js
// data.js
module.exports = {
  title: 'My Static Site',
  routes: [
    '/'
  ]
}
```

## Create Root.jsx

The Root component will include the `<html>` element, `<head>` and other code that will be shared across all pages.
The page components themselves will be passed through the `<RouteHander>` component with React Router.
To keep things somewhat organized, create this file in a new `components` directory.

```js
// components/Root.jsx
var React = require('react')
var Router = require('react-router')
var RouteHandler = Router.RouteHandler

var Root = React.createClass({
  render: function () {
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
// components/Index.jsx
var React = require('react')

var Index = React.createClass({
  render: function () {
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

Run the start script to start a development server.

```bash
npm start
```

Open <a href="http://localhost:8080" target="_blank">http://localhost:8080</a> in a browser.
You should see an unstyled page with the words _Index component_.

## Adding Pages

Next, add a new route for an _about_ page.
In `data.js` add `/about` to the routes array.

```js
// data.js
module.exports = {
  title: 'My Static Site',
  routes: [
    '/',
    '/about'
  ]
}
```

Edit the `Routes.jsx` file to handle the new route.

```js
// Routes.jsx
var React = require('react')
var Router = require('react-router')
var Route = Router.Route
var DefaultRoute = Router.DefaultRoute
var Root = require('./components/Root.jsx')
var Index = require('./components/Index.jsx')
var About = require('./components/About.jsx')

var Routes = (
  <Route handler={Root} path='/'>
    <DefaultRoute handler={Index} />
    <Route path='/about' handler={About} />
  </Route>
)

module.exports = Routes
```

Create a new `About.jsx` component.

```js
// components/About.jsx
var React = require('react')

var About = React.createClass({
  render: function () {
    return (
      <main>
        About component
      </main>
    )
  }
})

module.exports = About
```

Stop and restart the development server and navigate to
<a href="http://localhost:8080/about" target="_blank">http://localhost:8080/about</a>.
You should see a page similar to the index but with the words _About component_.

React-router can also handle route params such as `posts/:id` for dynamic routing –
<a href="http://rackt.github.io/react-router/" target="_blank">View the docs</a> to learn more.

## Render to Static Markup

Stop the development server and run `npm run webpack`. This should generate two static `index.html` files in the root and `about` directories.

## Adding Client-Side JS

In order to use React for client side JavaScript, you’ll need to ensure that the props match up between the static page and the bundle.js file.

First, edit `entry.js` to change the render function
from `React.renderToStaticMarkup` to `React.renderToString`
and add a conditional block that will only run client-side.

```js
// entry.js
var React = require('react')
var Router = require('react-router')
var Routes = require('./Routes.jsx')

if (typeof document !== 'undefined') {
  var initialProps = JSON.parse(document.getElementById('initial-props').innerHTML)
  Router.run(Routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createElement(Handler, initialProps), document)
  })
}

module.exports = function render(locals, callback) {
  Router.run(Routes, locals.path, function (Handler) {
    var html = React.renderToString(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>' + html)
  })
}
```

The `initialProps` value will come from a script tag with the id `initial-props`.
Update the Root component to add this script tag, add a `safeStringify` function, and link to the `bundle.js` file.

```js
// components/Root.jsx
var React = require('react')
var Router = require('react-router')
var RouteHandler = Router.RouteHandler

var Root = React.createClass({
  render: function () {
    var initialProps = {
      __html: safeStringify(this.props)
    }

    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          <RouteHandler {...this.props} />
          <script
            id='initial-props'
            type='application/json'
            dangerouslySetInnerHTML={initialProps} />
          <script src='bundle.js' />
        </body>
      </html>
    )
  }
})

function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = Root
```

## Navigation Links

To link the pages together, create a new Header component.

```js
// components/Header.jsx
var React = require('react')

var Header = React.createClass({
  render: function () {
    return (
      <header>
        <a href='/'>Index</a>
        <a href='/about'>About</a>
      </header>
    )
  }
})

module.exports = Header
```

Add the Header to the Root component’s render function.

```js
// components/Root.jsx
var React = require('react')
var Router = require('react-router')
var RouteHandler = Router.RouteHandler
var Header = require('./Header.jsx')

var Root = React.createClass({
  render: function () {
    var initialProps = {
      __html: safeStringify(this.props)
    }

    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          <Header />
          <RouteHandler {...this.props} />
          <script
            id='initial-props'
            type='application/json'
            dangerouslySetInnerHTML={initialProps} />
          <script src='bundle.js' />
        </body>
      </html>
    )
  }
})

function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = Root
```

## Using Client-Side Routing

React router can also do client-side routing using the Link component.
This can make transitioning pages feel faster and behaves like a fake single-page application.

To use client-side routing, replace the anchor links in the Header with React Routers’s Link components.

```js
// components/Header.jsx
var React = require('react')
var Router = require('react-router')
var Link = Router.Link

var Header = React.createClass({
  render: function () {
    return (
      <header>
        <Link to='/'>Index</Link>
        <Link to='/about'>About</Link>
      </header>
    )
  }
})

module.exports = Header
```

## Adding Critical CSS

Although there are many different approaches to styling components in React,
adding some critical CSS base styles to the head can help speed up performance and development time.
You can skip this step if you prefer using inline styles or linking to a larger stylesheet.

_UPDATE: Originally, this tutorial showed how to include CSS using props.
Using a combination of css-loader and cssnext-loader seems to be a better solution
as it doesn't require restarting the server when making changes to the stylesheet
and doesn't duplicate the CSS in the `initialProps` JSON object._


First install <a href="http://basscss.com" target="_blank">Basscss</a>,
<a href="https://github.com/webpack/css-loader" target="_blank">css-loader</a>,
and <a href="https://github.com/cssnext/cssnext-loader" target="_blank">cssnext-loader</a>.

```bash
npm i --save-dev basscss css-loader cssnext-loader
```

Add css-loader and cssnext-loader to the webpack config as well as options for cssnext.

```js
// webpack.config.js
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
      { test: /\.css/, loader: 'css-loader!cssnext-loader' }
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('bundle.js', data.routes, data)
  ],

  cssnext: {
    compress: true,
    features: {
      rem: false,
      pseudoElements: false,
      colorRgba: false
    }
  }

}
```

In the cssnext configuration options, the output is compressed and the rem and colorRgba postcss plugins have been disabled.

Create a new `css` directory and a `base.css` file.
Import Basscss and set a new value for the `--font-family` custom property.

```css
/* css/base.css */
@import 'basscss';

:root {
  --font-family: 'Avenir Next', 'Hevletica Neue', sans-serif;
}
```

In the Root component, import the stylesheet, add a style tag to the head, and add some padding to the body.

```js
// components/Root.jsx
var React = require('react')
var Router = require('react-router')
var RouteHandler = Router.RouteHandler
var Header = require('./Header.jsx')
var css = require('../css/base.css')

var Root = React.createClass({
  render: function () {
    var initialProps = {
      __html: safeStringify(this.props)
    }

    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </head>
        <body className='p2'>
          <Header />
          <RouteHandler {...this.props} />
          <script
            id='initial-props'
            type='application/json'
            dangerouslySetInnerHTML={initialProps} />
          <script src='bundle.js' />
        </body>
      </html>
    )
  }
})

function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = Root
```

Restart the dev server to see the changes.


You should now have a basic static site rendered with React.
For a complete example, see the
<a href="https://github.com/jxnblk/react-static-site-boilerplate" target="_blank">Boilerplate Demo</a>
or check out the
<a href="https://github.com/jxnblk/blog" target="_blank">source for this blog</a> or
<a href="https://github.com/basscss/basscss.github.io" target="_blank">the Basscss docs</a>,
which use a very similar approach.

*Update* Matthew Jones has forked and created an
<a href="https://github.com/ookk/react-static-boilerplate-ES6" target="_blank">ES6 boilerplate</a>
if you'd like to learn more.

## Other Considerations and Improvements

Since this uses webpack, there are also ways to include image assets and fonts in the bundle, but I haven’t tried this so your mileage may vary.

The `routes` array is passed in as props, and navigation links could be created dynamically rather than being hard coded.
This could make handling lots of pages easier.

If you’re hosting the static site on gh-pages, you’ll need a way to handle the base url when using React Router’s Link component.
I don’t know of a good way to do this yet and would love to hear suggestions on how to improve that.

~~Handling the CSS as shown above can lead to a fairly large chunk of JSON being inserted into the initial-props script tag,
and I’m not sure if there’s a better way to handle that.~~

This is just one way to build static sites with React.
If you’ve seen other ways or have any suggestions for improving on this, I’d love to hear them.


