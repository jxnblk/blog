---
title: Generating Color Palette Documentation from CSS
subhead: How to use Node.js modules to create color documentation for living style guides
created: 06-11-2015
tags:
  - css
  - color
  - documentation
  - style guide
  - living style guide
  - color contrast
  - accessibility
  - a11y
related:
  - name: Colorable
    href: http://jxnblk.com/colorable
  - name: postcss
    href: https://github.com/postcss/postcss
  - name: Basscss Color Combinations
    href: http://basscss.com/docs/reference/color-combinations
draft: true
---

Virtually every style guide has a color palette section in its documentation.
Many times I’ve seen this documentation created manually, where every change to a color requires updating the values in two places – the stylesheet and the style guide.
This often leads to the style guide falling out of sync with the actual values used on a site,
and makes maintaining a living style guide less efficient.

The problem with this approach is that two different things are serving as a source of truth.
For a true living style guide, the actual code should be the definitive source of truth,
so why not use CSS to populate the data for documentation?
This also helps expose legacy colors that should be removed and can point out ways to iteratively refactor and DRY up a code base.

The following will show how to use a combination of Node.js modules to build basic data-driven documentation for color palettes as well as present color contrast values for each combination as a guide for usage.

## Initial Setup

If you’re already using Node.js in you build system,
you can integrate this directly into your project.
For the purposes of this tutorial, create a new sandboxed project to experiment with.

```bash
mkdir color-documentation
cd color-documentation
npm init
```

Install the following modules.

```bash
npm i --save-dev postcss color colorable lodash
```

The [postcss](https://github.com/postcss/postcss) module will be used to transform the source CSS into an
<a href="http://en.wikipedia.org/wiki/Abstract_syntax_tree">
  <abbr title="Abstract Syntax Tree">AST</abbr>
</a>
for manipulation with JavaScript.
[Color](https://www.npmjs.com/package/color) will be used to convert the values found in the stylesheet to hexidecimal.
[Colorable](http://jxnblk.com/colorable) will be used to get color contrast values and
[W3AG](http://www.w3.org/TR/WCAG20/#visual-audio-contrast)
scores for every possible combination of colors.
And [lodash](https://lodash.com/docs) will be used to find unique color values and for creating a page template.

Copy a CSS file into the project to use as a source for the color values.
For this tutorial, you can use any stylesheet with colors or just download [Basscss](http://www.basscss.com/docs/).

## Build Script

Create a new `build.js` file that will be used to read the CSS file and eventually to generate an HTML page.

```js
// build.js
var fs = require('fs')

// Read the contents of basscss.css
var css = fs.readFileSync('basscss.css', 'utf8')

console.log(css)
```

For now, this script just prints the stylesheet.

## Package Scripts

Add a script to `package.json` for the build script.

```json
// package.json
"scripts": {
  "start": "node build"
}
```

Run the script to make sure everything is working.

```bash
npm start
```

## Parsing CSS

Create a new directory and module for `lib/parse-css.js`.

```js
// lib/parse-css.js
var _ = require('lodash')
var postcss = require('postcss')
var Color = require('color')

module.exports = function(css) {
  // Array of colors to return
  var colors = []

  // Parse the CSS file and get the AST
  var root = postcss.parse(css)

  return colors
}
```

## Filtering Properties

To keep things organized
Next update `build.js` to filter the declarations to only include `color` and `background-color` properties.
While color can be set for other properties and can set with the `background` shorthand, that adds complexity and will be omitted from this tutorial.

```js
// build.js
// ...
root.eachDecl(/color|background\-color/, function(decl) {
  // Log the property and value
  console.log(decl.prop, decl.value)
})
```

The first argument in `root.eachDecl` is a regular expression to filter declarations for either `color` or `background-color`.
See the [postcss documentation](https://github.com/postcss/postcss/blob/master/docs/api.md#containereachdeclpropfilter-callback) for more details.

<!--
  Outline
  - push to colors
  - convert to hex
  - remove inherit etc
  - remove duplicates
  - create template.html
  - pass colors array to template
  - list colors
  - list color values
  - colorable combinations
  - template for combos
-->

---
While this is not a complete replacement for human written documentation,
and creating guidelines around color usage requires carefully considered writing,
using an automated tool to generate data-driven documentation for color values can help create a
better living style guide.


<!--


Notes:

The [cssstats](http://github.com/cssstats/css-statistics) is the core Node.js module that powers the
[CSS Stats](http://cssstats.com) web app and will be used to 

-->
