---
title: A Conceptual Look at Theming
date: 2019-08-06
draft: true
---

The word *theme* can mean a lot of different things and invoke a lot of different interpretations,
which can be both a blessing and a curse.
In user interface design, the term *theming* is used for various purposes, inluding end-user customization, white labels, customizable UI components, and color variations such as dark and light modes.
Here, I'd like to step back and look at some of the foundational concepts that libraries like [Theme UI][], [Styled System][], [Rebass][], and [Basscss][] have been driven by.
This isn't meant to be an exhaustive analysis of theming in general, but more of a framework for how to think about UI design and design systems,
and how you can apply some of this thinking to your own work.

## Spectrum

When it comes to styling, there is a dichomoty between styles that are global and styles that are scoped to individual components.
Generally speaking, CSS tends towards the former and libraries like [Styled Components][] tend towards the latter.
When using any technology, how decoupled versus how scoped you choose to create your styles varies from application to application,
and each approach has its merits.
The spectrum spanning from global to component-based styles is a good yardstick for making decisions about styling responsibility when constructing a design system.

## Stylesheets

In the old ideal of [CSS Zen Garden][], styles are completely decoupled from components,
allowing the components to remain the same while the styles are swapped out one-by-one.
In practice, this is virtually impossible to achieve in a real world application with tens, hundreds, or thousands of contributors,
and in situations that have devolved into *append-only stylesheets*.
The global stylesheet can be thought of as a large object composed of many nested style objects that are intended for other components.
CSS rulesets are mapped to components via CSS selectors,
which is effectively a language-specific function
that takes stylesheets and full HTML element trees as inputs, and applies styles to element trees.

With this sort of approach, [dead code elimination][], [tree shaking][], and dynamic [code splitting][] of the styles is extremely difficult,
but styles are available *anywhere and everywhere* they *might* be needed.
For small sites and smaller teams, this approach can sometimes be the quickest and cheapest approach.

## Components

With a styled component approach, the default is complete isolation of styles.
This gives you dead code elimination of styles for free.
It also lends itself well to tree shaking and dynamic code splitting,
which can create huge performance improvements, especially in larger applications.
This also, inevitably, leads to duplication of styles.
While libraries like Styled Components offer a theming context,
the tendency is to use that as a simple mode switch rather than a store for shared styles.

## Scales

> scale: a graduated range of values forming a standard system for measuring or grading something

Styled System leverages the theming context in libraries like this to provide sets of style values in the form of *scales* that create the larger *theme object*.
**These scales create design constraints for specific style properties that help teams realize a consistent visual design language throughout an application's user interface.**
These scales become inputs to functional components.
In component-based UI development, the resulting interface is a function of data and/or state.
For styling interfaces, the theme object can be seen as a part of state,
where each component's styles becomes a function of the theme object, component-based styles, and component props.

## Responsibilities

With the abstraction provided by the theme object, different styling responsibilites can be put in different places.
Color definitions, typographic styles, space scales, and other commonly used style values become the responsibility of the theme object.
Dynamic styles based on viewport width become the responsibility of the component,
which lends itself well to contextual style changes based on content.

- Variants
- Theme UI MDX styles - is essentially a component
- Graph Theory

<!--
user interactions and other async operations create a completely new state

> scale: an arrangement of the notes in any system of music in ascending or descending order of pitch
-->

[theme ui]: https://theme-ui.com
[styled system]: https://styled-system.com
[rebass]: https://rebassjs.org
[basscss]: https://basscss.com
[styled components]: https://styled-components.com
[css zen garden]: http://www.csszengarden.com/
[dead code elimination]: https://en.wikipedia.org/wiki/Dead_code_elimination
[tree shaking]: https://en.wikipedia.org/wiki/Tree_shaking
[code splitting]: https://webpack.js.org/guides/code-splitting/
