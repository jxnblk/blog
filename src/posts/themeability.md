---
title: Themeability
date: 2019-07-11
draft: true
---

I started Basscss in 2015(?)
- heavily based on OOCSS
As a small utility-based css library for quickly styling applications based on scales of values, building on top of constraint-based design principles
It was a sibling project to Tachyons that aimed to be smaller and less intimidating to people unfamiliar with the approach of using single-purpose call names to compose styles together
Later, I attempted to bring some of the same constraint-based design principles into a library called Rebass
With the advent of styled components, this same underlying mechanism was extracted out into the Styled system library, which allows component authors to use typographic, color and layout scales defined in a theme object to create components with style props,
Offering a balance of consistency with a certain level of flexibility to meet the fast-paced development iteration cycle seen on many development teams

Styled system was originally conceived of as a way to build custom design systems that make doing the right thing easier

- link to tenets post

As many teams have started to adopt styled system over the years, I've noticed a few areas where this library falls short
- you have to create custom components to make the most of the library
- It doesn't provide a lot of guidance on how to create, organize, or use those components
- It's unopinionated about implementation details
- it's fairly unopinionated in how Theme objects should be shaped - while use in white label applications is certainly possible, the details differ from one implementation to another
- The boundaries of flexibility on a per-component basis are hard cliffs - If a style prop isn't exposed on a particular component, it can



- Styled-system
- Uses a "theme" but leaves a lot of the implementation details open to interpretation
- Styled system is intended as a tool that development teams can leverage to build component libraries and design systems with a simple and predictable API
- Styled system is intentionally unopinionated
- Many use it with styled-components or emotion but it also works anywhere JS can be used, including Vuejs, Svelte, Angular, or even Node.js
- Styled System falls short:
	- Styling content heavy sites, such as pages written in markdown or MDX
	- Requires developers to create their own components
	- Doesn't provide guidance for making themeable UI
- Theme UI is a mini framework for styling React applications
- The theme object uses a concept of scales to store sets of related values
- ensure that typography, color, and layout styles (the trifecta) are applied consistently across an entire application
- Based on the System UI Theme Specification Level 2
- Level 2 conformance means that the shapes of theme scales themselves are standardized across multiple themes
- For example all themes must define both `colors.text` and `colors.background` for setting the base colors
- If you use design tokens, they can be used to populate the theme object
- Theme UI only requires that the theme object conforms to a particular schema that is JSON serializable, but it doesn't matter how you store or generate this object

- Differences from Styled system:
	- Built with React
	- Emotion
	- The `sx` prop
	- MDX support for content-heavy applications
	- Built in utilities for dark mode
	- Optional packages to work with other libraries in the larger ecosystem


- Styled system
	- framework agnostic
	- mechanism to map themes to styles
- Rebass
	- React components built with styled system
- Theme UI
	- Styling library built with styled system
	- MDX support
	- Color modes
	- Custom pragma for the `sx` prop
	- Specification for interoperable themes
	-


