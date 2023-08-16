---
title: Patterns for Style Composition in React
excerpt: "While React is extremely flexible in terms of how you can structure your application’s UI, I’ve found that a few patterns for style composition have helped me keep things organized and easy to work with."
date: 2016-08-13
tags:
  - css
  - css-in-js
  - design systems
  - style guides
  - react
related:
  - name: Pure UI by Guillermo Rauch
    href: http://rauchg.com/2015/pure-ui/
  - name: CSS in JS by Christopher "vjeux" Chedeau
    href: https://speakerdeck.com/vjeux/react-css-in-js
  - name: Presentational and Container Components by Dan Abramov
    href: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.68k59nncg
  - name: Reflexbox
    href: http://jxnblk.com/reflexbox
  - name: Rebass
    href: http://jxnblk.com/rebass
  - name: Robox
    href: https://github.com/jxnblk/robox
  - name: Understyle
    href: https://github.com/jxnblk/understyle
---

While React is extremely flexible in terms of how you can structure your application’s UI,
I’ve found that a few patterns for style composition have helped me keep things
organized and easy to work with.
These aren’t hard-and-fast rules, these are simply reflections on how I’ve come to organize components in apps that I’ve worked on.

I’ve gravitated towards these patterns in an effort to:

- Create a well-defined visual design system
- Help maintain visual consistency across an application
- Only deliver the CSS/styles needed to the client for a given UI – i.e. performance
- Increase the maintainability of visual styles
- Make updates and iterations on styles easier
- Make legacy styles easier to deprecate
- Create more readable components
- Make building out new UI easier and faster
- Keep styles encapsulated to help prevent collisions and unwanted side effects
- Create an easy-to-use component API for non-front-end developers

Although the level of abstraction here might look like overkill for smaller projects,
I find that this general approach has sped up my development across the board.

I won’t get into approaches for state management or handling the business logic of your app,
instead I’ll be focusing primarily on the visible and interactive parts of the UI.

## Stateless Functional UI Components

Generally, I like to keep styles separated from the parts of the app that are tied to state.
That means routes, views, containers, forms, layouts, etc. should not have any styling or classes in them.
Instead, these heavy-lifting components should be composed of primarily stateless functional UI components,
sometimes referred to as *presentational* components.
By keeping styling concerns separate from the application state,
pieces can become more reusable and building out new views and containers can be quicker.


For example, a form component render method might look something like this:

```js
render () {
  return (
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
      <Button
        type='submit'
        children='Sign In' />
    </form>
  )
}
```

Notice how none of the elements have a `className` or `style` prop.
Using `className` or `style` props at this level *could* be considered a code smell.
Each UI component used here encapsulates its own styling,
and the styling simply becomes an implementation detail,
which means a UI component can be updated or refactored without affecting anything else in the application.

An example Button component, like the one in the form above, might look something like the following:

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

```js
// Button usage
<Button onClick={this.handleClick}>
  Hello
</Button>
```

I’ve used inline styles here for readability and to help demonstrate how this works,
but any CSS-in-JS solution can be used instead and won’t have any affect on the form component above.
By keeping all styling encapsulated in this component,
the rest of the application doesn’t need to know anything about the Button beyond its props API.

## Styles Module

You may have noticed that a few property values were hard-coded into the Button example.
Generally, I wouldn’t recommend hard-coding things in like that.
Any values that are likely to be used across different UI components should be split into their own module.

Here is an example module to start with:

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
including borders, border radii, shadows, animation duration, etc.

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
For example, a function to create `rgba` values of black can be very handy.

```js
const darken = (n) => `rgba(0, 0, 0, ${n})`

darken(1 / 8) // 'rgba(0, 0, 0, 0.125)'
```

Functions like this can then be used to create a value scale array to help keep things consistent.

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

Another example would be creating a scale for margin and padding to help keep visual rhythm consistent.

```js
// Modular powers of two scale
const scale = [
  0,
  8,
  16,
  32,
  64
]

// Functions to get partial style objects
const createScaledPropertyGetter = (scale) => (prop) => (x) => {
  return (typeof x === 'number' && typeof scale[x] === 'number')
    ? { [prop]: scale[x] }
    : null
}
const getScaledProperty = createScaledPropertyGetter(scale)

export const getMargin = getScaledProperty('margin')
export const getPadding = getScaledProperty('padding')
```

```js
// Style function usage
const Box = ({
  m,
  p,
  ...props
}) => {
  const sx = {
    ...getMargin(m),
    ...getPadding(p)
  }

  return <div {...props} style={sx} />
}
```

```js
// Component usage
<div>
  <Box m={2} p={3}>
    A box with 16px margin and 32px padding
  </Box>
</div>
```

## Npm Modules

While the rgba color function above is a fairly simple one,
sometimes more complex color transformations can be helpful when creating UI.
Well, we’re in luck, because we can use literally anything on [npm](https://npmjs.com).

Instead of the `darken` function above, here is an example using [`chroma-js`](https://www.npmjs.com/package/chroma-js)’s `alpha` function.

```js
import chroma from 'chroma-js'

const alpha = (color) => (a) => chroma(color).alpha(a).css()

const darken = alpha('#000')

const shade = [
  darken(0),
  darken(1 / 8),
  darken(1 / 4),
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

Beyond just importing style values, there is a tremendous amount of flexibility
when it comes to composition in React – since components are essentially just functions.
Take the Button component from above, and we’ll change some of the style details to props to make it more reusable.

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

```js
// Usage example
<div>
  <Button>
    Blue Button
  </Button>
  <Button big backgroundColor={colors.red}>
    Big Red Button
  </Button>
</div>
```

The `color` and `backgroundColor` properties have been moved up to the component’s props.
Additionally, we’ve added a `big` prop to adjust the padding top and bottom.

Now this component is fine by itself, but what if we want a secondary button style?
Doing the following would become tedious and error prone very quickly:

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

```js
// Usage example
<div>
  <Button>Normal Button</Button>
  <ButtonSecondary>Secondary Button</ButtonSecondary>
</div>
```

By adjusting the props API of the base Button component, an entire set of button styles can be created.

```js
const ButtonBig = (props) => <Button {...props} big />
const ButtonGreen = (props) => <Button {...props} backgroundColor={colors.green} />
const ButtonRed = (props) => <Button {...props} backgroundColor={colors.red} />
const ButtonOutline = (props) => <Button {...props} outline />
```

This pattern lends itself well to layout components as well.
Assume we have a generic Box component that accepts props for various layout styles.
This base layout component can then be used to create grid system components and other primitives.

```js
const Grid = (props) => (
  <Box {...props}
    display='inline-block'
    verticalAlign='top'
    px={2} />
)

const Half = (props) => (
  <Grid {...props}
    width={1 / 2} />
)

const Third = (props) => (
  <Grid {...props}
    width={1 / 3} />
)

const Quarter = (props) => (
  <Grid {...props}
    width={1 / 4} />
)

const Flex = (props) => (
  <Box {...props}
    display='flex' />
)

const FlexAuto = (props) => (
  <Box {...props}
    flex='1 1 auto' />
)
```

```js
// Usage example
<div>
  <div>
    <Half>Half width column</Half>
    <Half>Half width column</Half>
  </div>
  <div>
    <Third>Third width column</Third>
    <Third>Third width column</Third>
    <Third>Third width column</Third>
  </div>
  <div>
    <Quarter>Quarter width column</Quarter>
    <Quarter>Quarter width column</Quarter>
    <Quarter>Quarter width column</Quarter>
    <Quarter>Quarter width column</Quarter>
  </div>
</div>
```

Typography styles are another great candidate for building up with composition.
By using a base typographic component, you can help ensure consistency and keep your styling DRY.

```js
import React from 'react'
import { alternateFont, typeScale, boldFontWeight } from './styles'

const Text = ({
  tag = 'span',
  size = 4,
  alt,
  center,
  bold,
  caps,
  ...props
}) => {
  const Tag = tag
  const sx = {
    fontFamily: alt ? alternateFont : null,
    fontSize: typeScale[size],
    fontWeight: bold ? boldFontWeight : null,
    textAlign: center ? 'center' : null,
    textTransform: caps ? 'uppercase' : null
  }

  return <Tag {...props} style={sx} />
}
```

```js
const LeadText = (props) => <Text {...props} tag='p' size={3} />
const Caps = (props) => <Text {...props} caps />
const MetaText = (props) => <Text {...props} size={5} caps />
const AltParagraph = (props) => <Text {...props} tag='p' alt />

const CapsButton = ({ children, ...props }) => (
  <Button {...props}>
    <Caps>
      {children}
    </Caps>
  </Button>
)
```

```js
// Usage example
<div>
  <LeadText>
    This is a lead with some <Caps>all caps</Caps>.
    It has a larger font size than the default paragraph.
  </LeadText>
  <MetaText>
    This is smaller text, like form helper copy.
  </MetaText>
</div>
```

Keep in mind, that these components are just a few examples and your needs will vary greatly on an app-by-app basis.

## Higher Order Components

I’m generally a fan of keeping most of an applications state at the top level of a React tree,
often using something like [Redux](https://github.com/reactjs/redux).
However, sometimes there are isolated UI components that only require a minimal amount of state for interaction,
and using them as standalone components is sufficient.

One example of this is a carousel[*](#*), where the state of the current slide generally doesn’t need to persist across page views.
Instead of combining the state of the carousel with its UI, we can create a higher order component for better reusability.
The higher order component will have a current slide index and have previous and next methods.

```js
// Higher order component
import React from 'react'

// This could be named something more generic like Counter or Cycle
const CarouselContainer = (Comp) => {
  class Carousel extends React.Component {
    constructor () {
      super()
      this.state = {
        index: 0
      }
      this.previous = () => {
        const { index } = this.state
        if (index > 0) {
          this.setState({ index: index - 1})
        }
      }

      this.next = () => {
        const { index } = this.state
        this.setState({ index: index + 1 })
      }
    }

    render () {
      return (
        <Comp
          {...this.props}
          {...this.state}
          previous={this.previous}
          next={this.next} />
      )
    }
  }

  return Carousel
}

export default CarouselContainer
```

Using a higher order component we can create a carousel from any number of UI elements.
For example, a simple carousel may have only previous and next buttons,
while a more complex one might include image thumbnails of each slide across the bottom.
Both of these can use the same higher order component to handle their state.

```js
// UI component
const Carousel = ({ index, ...props }) => {
  const length = props.length || props.children.length || 0

  const sx = {
    root: {
      overflow: 'hidden'
    },
    inner: {
      whiteSpace: 'nowrap',
      height: '100%',
      transition: 'transform .2s ease-out',
      transform: `translateX(${index % length * -100}%)`
    },
    child: {
      display: 'inline-block',
      verticalAlign: 'middle',
      whiteSpace: 'normal',
      outline: '1px solid red',
      width: '100%',
      height: '100%'
    }
  }

  const children = React.Children.map(props.children, (child, i) => {
    return (
      <div style={sx.child}>
        {child}
      </div>
    )
  })

  return (
    <div style={sx.root}>
      <div style={sx.inner}>
        {children}
      </div>
    </div>
  )
}
```

```js
// Final Carousel component
const HeroCarousel = (props) => {
	return (
    <div>
      <Carousel index={props.index}>
        <div>Slide one</div>
        <div>Slide two</div>
        <div>Slide three</div>
      </Carousel>
      <Button
        onClick={props.previous}
        children='Previous' />
      <Button
        onClick={props.next}
        children='Next' />
    </div>
	)
}

// Wrap the component with the functionality from the higher order component
export default CarouselContainer(HeroCarousel)
```

```js
// Usage example
<div>
  <HeroCarousel />
</div>
```

By keeping the styling separate from the interactive state,
any number of carousel variations can be created from these reusable parts.

Just like the base component pattern above, higher order components
can work well for styling layout, typography and colors.
This is the same pattern used in [Reflexbox](https://github.com/jxnblk/reflexbox),
and similar to Rebass’s [Base component](https://github.com/jxnblk/rebass/blob/master/src/Base.js).

## Further Exploration

These are just a few patterns that I’ve found to be the most useful
when it comes to styling UI in a component-based system.
I’m curious to know if anyone else has found similar patterns that they’ve found helpful,
and I’m sure there are even more ways to create more beautiful, more flexible, and more maintainable visual design systems.

---

### A Note About Performance

While there are many different ways to handle styling in a component-based app,
make sure to pay close attention to the size of your bundle.
It can be easy to create the wrong abstractions and end up with needless bloat.
Some of the patterns in this article, when taken to their logical extreme,
could actually harm the performance and create a degraded experience for your end users.

And remember, everything related to styling that you do should be for the user’s benefit, not your own.

---

<small id='*'>* Please don’t use carousels in your app. Users hate them.</small>


