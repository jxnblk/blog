---
title: Universal UI Components
date: 2016-07-06
related:
  - name: Components
    href: http://jxnblk.com/blog/posts/components
  - name: Universal Components
    href: http://jxnblk.com/universal-components
  - name: Rebass
    href: http://jxnblk.com/rebass
  - name: cxs
    href: http://jxnblk.com/cxs
  - name: React-cxs
    href: http://jxnblk.com/react-cxs
  - name: hyp
    href: http://jxnblk.com/hyp
---

For a while now, I’ve been interested in the idea of creating portable,
interoperable functional UI components that can work in any DOM rendering library,
whether it’s
[React](https://facebook.github.io/react/),
[Preact](https://preactjs.com),
[hyperscript](https://github.com/dominictarr/hyperscript),
[bel](https://github.com/shama/bel),
[yo-yo](https://github.com/maxogden/yo-yo),
or some other library.

The idea of functional UI components is a simple one: pass arguments into a function and it returns a representation of the DOM,
usually with encapsulated styles and interactivity handled with callbacks to a global state, a la Redux.

If you look at the currently available technology, there are predominantly three ways to create these components:
- [**JSX**](https://facebook.github.io/jsx/) (from React) - uses an XML-like syntax to call functions that return representations of DOM elements
- [**Hyperscript**](https://github.com/dominictarr/hyperscript) - similar to JSX, but uses standard JavaScript syntax and function calls
- [**ES2015 tagged template literals**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) - a new string type introduced to JavaScript

Each has its own pros and cons. While JSX is mostly syntactic sugar, some prefer to use standard JavaScript syntax.
One big advantage JSX has is that it abstracts away the function used to create DOM elements.
For example, React uses `React.createElement` while Preact uses `Preact.h`.
The pragma used in JSX is configurable by the end user.
Hyperscript, although older than JSX, uses a similar function, but is written in standard JavaScript.
Tagged template literals are also standard JavaScript,
but require a little bit of extra code to change template literals into DOM elements.

## The same, but different

Assuming we pick one of the above syntaxes,
there are relatively few differences among the implementations of components across libraries.
For example, here is a bare-bones Button component for several different libraries.
For brevity, styles have been left out of these examples.

```js
// React using JSX
import React from 'react'

const Button = (props) => (
  <button {...props} />
)
export default Button
```

```js
// Preact using JSX
import { h } from 'preact'

const Button = (props) => (
  <button {...props} />
)
export default Button
```

```js
// Hyperscript
import h from 'hyperscript'

const Button = (props) => (
  h('button', props)
)
export default Button
```

```js
// yo-yo using tagged template literals
import yo from 'yo-yo'

const Button = ({ text, ...props }) => (
  yo`<button ${props}>${text}</button`
)
export default Button
```

There are still quite a few differences in syntax between JSX, hyperscript, and tagged template literals.
For the sake of this post, I’ll focus on implementing these components in JSX.

The first three examples are covered, but here’s what the hyperscript and yo-yo examples would look like in JSX.

```js
// Hyperscript with JSX
import h from 'hyperscript'

const Button = (props) => (
  <button {...props} />
)
export default Button
```

```js
// bel (yo-yo) with JSX
// yo-yo uses the bel package to create elements
import { createElement } from 'bel'

const Button = (props) => (
  <button {...props} />
)
export default Button
```

For each of the non-React versions, JSX needs to be configured to use the appropriate pragma.
Hyperscript and Preact both name their create element functions `h`.
Here is an example `.babelrc` configuration.

```json
{
  "presets": [
    "es2015",
    "stage-0"
  ],
  "plugins": [
    [
      "transform-react-jsx",
      { "pragma": "h" }
    ]
  ]
}
```

Although the other libraries name their create element functions differently,
they can all be named `h` within the components for cross-library compatibility.

```js
// React using JSX
import { createElement as h } from 'react'

const Button = (props) => (
  <button {...props} />
)
export default Button
```

At this point, the only difference in these components across libraries is the `import` statement.
Using a module bundler like webpack, even this can be abstracted out of the component module.

Using webpack’s ProvidePlugin, the create element function can be exposed to all modules.
This does involve having a variable in the global scope, but I think the trade-off might be worth it in some cases.

```js
// Custom create-element module
const h = require('preact').h
module.exports = h
```

```js
// Example webpack configuration for Preact
const path = require('path')
const webpack = require('webpack')

module.exports = {
  ...,
  plugins: [
    new webpack.ProvidePlugin([
      h: path.resolve('./preact-create-element')
    ])
  ]
}
```

To avoid variable collisions, the function could be named anything (e.g. `__h`) as long as the `.babelrc` pragma matches.

In addition to the name of the create element function, there are some slight differences in the naming conventions
for HTML attributes (e.g. `htmlFor` and `className`) and handling child elements.
Transforming these props could be handled in the custom function, but the implementation details have been left out of this post.

With this configuration, the Button component can now be written like this:

```js
const Button = (props) => (
  <button {...props} />
)
export default Button
```

I’ve put up a rough demonstration of this concept, with the same two UI components being rendered to the DOM by
React, Preact, hyperscript, and bel here: [Universal Components](http://jxnblk.com/universal-components).

With a little bit of configuration, a whole library of UI components could be written in a manner that would allow
the DOM rendering library to be swapped out at some point in the future,
without the need to use a tool like [Codemod](https://github.com/facebook/codemod).
There’s probably even a way to wrap components in an open-source library like [Rebass](http://jxnblk.com/rebass)
to make them compatible with more than one functional DOM rendering library as well.

