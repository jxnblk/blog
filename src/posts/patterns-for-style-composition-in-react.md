---
title: Patterns for Style Composition in React
created: 8-3-2016
draft: true
---

While React is extremely flexible in terms of how you can structure your application’s UI,
I’ve found that a few patterns for style composition have helped me keep things
organized and easy to work with.

I won’t get into approaches for state management or handling the business logic of your app,
instead I’ll be focusing primarily on the visible and interactive parts of the UI.

## Stateless Functional UI Components

Generally, I like to keep styles out of the parts of the app that are tied to business logic and state.
That means routes, views, containers, forms, and layouts should not have any styling or classes in them.
Instead, these heavy-lifting components should be composed of primarily stateless functional UI components,
sometimes referred to as *presentational* components.

A hypothetical form component render function might look something like this:

```js
<form onSubmit={this.handleSubmit}>
  <Heading children='Sign In' />
  <Input
    name='username'
    value={username}
    onChange={this.handleChange} />
  <Input
    type='password'
    name='password'
    value={password}
    onChange={this.handleChange} />
  <ButtonPrimary
    type='submit'
    children='Sign In' />
</form>
```

Notice how none of the elements have a `className` or `style` prop.
Each UI component used here encapsulates its own styling, and the styling simply becomes an
implementation detail.

An example Button component might look something like the following:

```js
const Button = ({
  ...props
}) => {
  const sx = {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    margin: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    border: 0,
    color: 'white',
    backgroundColor: 'blue',
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  }

  return (
    <button {...props} style={sx} />
  )
}
```

I’ve used inline styles here for readability and to help demonstrate how this works, but using a CSS-in-JS solution,
or even something like CSS modules can easily be swapped out, and won’t have any affect on the form component above.
By keeping all styling encapsulated in this component, the rest of the application doesn’t need to know anything about the Button
beyond its props API.

## Styles Module

You may have noticed that a few properties were hard-coded into the Button example.
I wouldn’t recommend hard-coding things in like that.
Any values that are likely to be used across different UI components should be split into their own module.

Here is a simple example module to start with:

```js
export const white = '#fff'
export const black = '#111'
export const blue = '#07c'

export const colors = {
  white,
  black,
  blue
}

export const space = [
  0,
  8,
  16,
  32,
  64
]

const styles = {
  bold: 600,
  space,
  colors
}

export default styles
```

And here is what the updated Button component could look like:


```js
import React from 'react'
import { bold, space, colors } from './styles'

const Button = ({
  ...props
}) => {
  const sx = {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: bold,
    textDecoration: 'none',
    display: 'inline-block',
    margin: 0,
    paddingTop: space[1],
    paddingBottom: space[1],
    paddingLeft: space[2],
    paddingRight: space[2],
    border: 0,
    color: colors.white,
    backgroundColor: colors.blue,
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  }

  return (
    <button {...props} style={sx} />
  )
}
```

The style object could store anything related to styling that is shared across components,
including: borders, border radii, shadows, animation duration, etc.

You could even export more elaborate combinations of styles like the following:

```js
export const cardStyle = {
  backgroundColor: white,
  borderRadius: 3,
  boxShadow: `0 0 4px ${shade[1]}`
}
```

But I’d recommend delegating combinations like these to components and using composition instead, as I’ll show below.

## Style Functions

Since we’re using JavaScript, we can also employ helper functions for styling elements.
For example, a function to create `rgba` values of black is very convenient.

```js
const darken = (n) => `rgba(0, 0, 0, ${n})`

darken(1 / 8) // 'rgba(0, 0, 0, 0.125)'
```

Functions like this can then be used to create scale array to help keep things consistent.

```js
const shade = [
  darken(0),
  darken(1 / 8),
  darken(1 / 4),
  darken(3 / 8),
  darken(1 / 2),
  darken(5 / 8),
  darken(3 / 4),
  darken(7 / 8),
  darken(1)
]

shade[4] // 'rgba(0, 0, 0, 0.5)'
```

TK: margin/padding scale function

## Npm Modules

While the function above is a fairly simple one,
sometimes more complex color transformations can be helpful when creating UI.
Well, we’re in luck, because we can use literally anything on npm.

Instead of the `darken` function above, here is an example using [`chroma-js`](https://www.npmjs.com/package/chroma-js)’s `alpha` function.

```js
import chroma from 'chroma-js'

const alpha = (color) => (a) => chroma(color).alpha(a).css()

const darken = alpha('#000')

const shade = [
  darken(0),
  // ...
]
```

Using chroma, this function can work with any color from the style object.

```js
const blueAlpha = [
  alpha(blue)(0),
  alpha(blue)(1 / 4),
  alpha(blue)(1 / 2),
  alpha(blue)(3 / 4),
  alpha(blue)(1)
]
```

## Base Component

Beyond just importing style values, there is a tremendous amount of flexibility when it comes to component
composition when using React.
Take the Button component from above, and we’ll extract some of the style details to props to make it more reusable.

```js
const Button = ({
  big,
  color = colors.white,
  backgroundColor = colors.blue,
  ...props
}) => {
  const sx = {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: bold,
    textDecoration: 'none',
    display: 'inline-block',
    margin: 0,
    paddingTop: big ? space[2] : space[1],
    paddingBottom: big ? space[2] : space[1],
    paddingLeft: space[2],
    paddingRight: space[2],
    border: 0,
    color,
    backgroundColor,
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  }

  return (
    <button {...props} style={sx} />
  )
}
```

The `color` and `backgroundColor` properties have been moved up to the component's props.
Additionally, we’ve added a `big` prop to adjust the padding top and bottom.

Now this component is fine by itself, but what if we want a secondary button style?
Doing the following would become tedious very quickly:

```js
<Button
  color={colors.black}
  backgroundColor={colors.lightblue}
  children='Secondary Button' />
```

Instead, we can create a dedicated secondary button component.

```js
import React from 'react'
import Button from './Button'

const ButtonSecondary = (props) => (
  <Button
    {...props}
    color={colors.black}
    backgroundColor={colors.lightblue} />
)
```

<!--
- Base component
  - Button/ButtonPrimary/ButtonSecondary/ButtonOutline/IconButton
  -->

## Higher Order Components

I'm generally a fan of keeping most of an applications state at the top level of a react tree,
often with something like redux,
however, sometimes there are isolated UI components that need a minimal amount of state for interaction.

One example of this is a carousel, where the state of the current slide generally doesn’t need to persist across page views.
Instead of combining the state of the carousel with its UI, we can create a higher order component for better reusability.
The higher order component will have a current slide index, accept a length prop or get the length of children, and have methods for setting position.

```js
```

Using a higher order component we can create a carousel from any number of UI elements.
For example, a simple carousel may have only previous and next buttons,
while a more complex one might include image thumbnails of each slide across the bottom.
Both of these can use the same hoc to handle their state.


Higher order components can also be used to encapsulate frequently used generic styling,
for example margin, padding, and display.
This is the pattern used in Reflexbox, which is an extension of an even simpler Robox component.

These higher order components wrap other components and add helper props such as m, mb, p, px, etc.
They can even be abstracted into convenient components like boxes and grid columns


<!--
- Higher order components
  - Carousel/Cycle hoc example
  -->

