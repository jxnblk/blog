---
title: A Conceptual Look at Theming
date: 2019-08-06
draft: true
---

The word *theme* can mean a lot of different things and invoke a lot of different interpretations.
That's both a blessing and a curse.
In UI design, the term *theming* is used for various purposes, inluding end-user customization, white labels, off-the-shelf UI components, and color variations such as dark and light modes.
Here, I'd like to step back and look at some of the foundational concepts that libraries like [Theme UI][], [Styled System][], [Rebass][], and [Basscss][] have been driven by.
This isn't meant to be an exhaustive analysis of theming in general, but more of a framework for how to think about UI design and creating design systems,
and how you can apply some of this thinking to your own work.

When it comes to styling, there is a dichomoty between styles that are completely decoupled and separate from components
and styles that are isolated and scoped to individual components.
Generally speaking, CSS tends towards the former and libraries like [Styled Components][] tend towards the latter.
How decoupled or scoped you choose to create your styles varies from application to application, and each approach has its merits.

## Stylesheets

In the ideal of [CSS Zen Garden][], styles are completely decoupled from components, allowing the components to remain the same while the styles are swapped out one-by-one.
In practice, this is virtually impossible to achieve in a real world application with hundreds or thousands of contributors.
The global stylesheet can be viewed as a large object composed of many style objects that are intended for other components.
CSS rulesets are mapped to components via CSS selectors,
which is effectively a function where the inputs are a stylesheet and a full HTML element tree, returning a styled interface.

With this sort of approach, [dead code elimination][], [tree shaking][], and dynamic [code splitting][] of the styles is extremely difficult,
but styles are available *anywhere and everywhere* they *might* be needed.

## Components

With a styled component approach, the default is complete isolation of styles.
This gives you dead code elimination of styles for free.
It also lends itself well to tree shaking and dynamic code splitting, which can create huge performance improvements, especially in larger applications.
This also, inevitably, leads to duplication of styles.
While libraries like Styled Components offer a theming context,
the tendency is to use that as a simple mode switch rather than a store for shared styles.

## Scales

Styled System leverages the theming context in libraries like this to provide sets of style values in the form of *scales* that create the larger *theme object*.
**These scales create design constraints for specific style properties that help teams realize a consistent visual design language throughout an application's user interface.**
These scales become inputs to functional components.
In component-based UI development, the resulting interface is a function of data and/or state, where user interactions update the state.
For styling interfaces, the theme object can be seen as a part of state,
where each component's styles becomes a function of the theme object and component-based styles or style props.

Definitions of *Scale*

> a graduated range of values forming a standard system for measuring or grading something

> an arrangement of the notes in any system of music in ascending or descending order of pitch

<!--
- Theme
  - Scales
    - Style Values
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
