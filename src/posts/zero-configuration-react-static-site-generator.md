---
title: 'Zero-Configuration React Static Site Generator'
created: '02-14-2016'
tags:
  - react
  - static-site-generator
related:
  - name: Static Site Generation with React and Webpack
    href: http://jxnblk.com/writing/posts/static-site-generation-with-react-and-webpack/
draft: true
---

React is a great component-based UI library well suited to generating static HTML. One of the biggest hurdles to working with React is the amount of boilerplate and build configuration it takes to get going. I wanted to make it dead-simple to get started building static pages without the need to install tons of npm modules and configure webpack.

That's where static-react comes in. I started this repo a while back, but never got it to work quite like I imagined.

## 1. Install Things

```sh
npm i -D react static-react babel-preset-es2015 babel-preset-react
```

- presets are optional

## 2. Npm Run Script

Add a run script to package.json.

```json
"scripts": {
  "start": "static-react components/Root.js > index.html"
}
```

## 3. Babel Configuration

Add the following to package.json.

```json
"babel": {
  "presets": [
    "es2015",
    "react"
  ]
}
```

## 4. Add Components

Create a `components` directory and a `Root.js` React component.

```js
// Root.js
import React from 'react'

class Root extends React.Component {
  render () {
    return <h1>Hello</h1>
  }
}

export default Root
```

## 5. Build

```sh
npm start
```

Open `index.html` and you should see the rendered Root component.

## Building Out a Page

You'll certainly want more than just a heading in the final page. Build out some more components and run `npm start` to rebuild.

Here is an example set of starter components:

```js
// Root.js
import React from 'react'
import Head from './Head'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'

class Root extends React.Component {
  render () {
    return (
      <html>
        <Head title='Static React Demo' />
        <body className='px3'>
          <Header title='Hello' />
          <Main />
          <Footer />
        </body>
      </html>
    )
  }
}

export default Root
```

```js
// Head.js
import React from 'react'

const Head = ({ title }) => (
  <head>
    <meta charSet='utf-8' />
    <title>{title}</title>
    <link href='https://npmcdn.com/basscss-basic@1.0.0/index.css' rel='stylesheet' />
    <link href='https://npmcdn.com/basscss@8.0.0/css/basscss.min.css' rel='stylesheet' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
  </head>
)

export default Head
```

```js
// Header.js
import React from 'react'

const Header = ({ title }) => (
  <header className='py3'>
    <h1>{title}</h1>
  </header>
)

export default Header
```

```js
// Main.js
import React from 'react'

const Main = () => (
  <main className='py4'>
    <img src='http://lorempixel.com/256/256/cats/'
      alt='Kitten' />
  </main>
)

export default Main
```

```js
// Footer.js
import React from 'react'

const Footer = () => (
  <footer className='py3'>
    <p>© 2016 Brent Jackson</p>
  </footer>
)

export default Footer
```


