---
title: 'Zero-Configuration React Static Site Generator'
created: '02-15-2016'
tags:
  - react
  - static-site-generator
related:
  - name: Static Site Generation with React and Webpack
    href: http://jxnblk.com/writing/posts/static-site-generation-with-react-and-webpack/
---

React is a great way to generate static HTML with a component-based UI.
One of the biggest hurdles to working with React is the amount of boilerplate and build configuration it takes to get going.
I wanted to make it dead-simple to start building static pages with React
and without the need to install tons of npm modules and configure webpack.

That’s where [static-react](https://github.com/jxnblk/static-react) comes in. Here’s out to get started.

*Update: As of version 3.2.0, static-react includes Babel presets and they do not need to be installed separately. This post has been updated to reflect those changes.*

## 1. Install Dependencies

```sh
npm i -D react static-react
```

~~The Babel presets are optional, but make working with React much nicer, in my opinion.~~

## 2. Add a Run Script

Add the following run script to package.json.

```json
"scripts": {
  "start": "static-react components/Root.js > index.html"
}
```

## ~~3. Configure Babel (Optional) [*](#1)~~

~~Add the following to package.json.~~

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

You'll certainly want more than just a heading in the final page.
Build out some more components and run `npm start` to rebuild.

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

If you have any thoughts on or issues with the static-react module, please check out the repo on [GitHub](https://github.com/jxnblk/static-react).


<p id="1" class="mt3 italic">
  <del>* Technically, I guess this post should be titled <b>Near-Zero-Configuration</b>, but using Babel is completely optional.</del>
</p>

