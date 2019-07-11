---
title: The Modern Front-End Design System
date: 2019-07-11
draft: true
---

Design systems come in all shapes in sizes and can encompass a wide range of skillset and roles within an organization.
As a front-end developer, I'd like to share some of the tooling that I've found beneficial for building and maintaining the components and code for design systems in modern applications.

On more than one occasion, I've been asked what a blessed "Jackson Stack" (or Jxnstk for short) would look like.
While this stack has changed and will continue to change over time,
the following is what I consider to be best-in-class tools for building and maintaining design systems in 2019.
This list doesn't attempt to cover every aspect, and there is always room for experimentation and exploration, so please take this as more of a starting point rather than a canonical list of tools to use.

I use the term *modern* here to reference React and related technologies.
This is in no way meant to be exclusive, but I think it reflects some of the industry-standard, component-based approaches that many front-end developers are working within.
If you're looking for a full-time role as a *front-end developer*, chances are you'll be working with either Angular (yes, it's still *very* widely used) or React.
There are other roles and different types of developers, so whether you're a full-stack dev working on a Rails app, or a designer working in CSS, I hope that you can steal some ideas or gain some inspiration for the tech stack that you work with.

## Components

Modern front-end applications are built upon functional, component-based architectures, with unit tests, end-to-end tests, performance budgets and gate-checks, accessibility, A/B experimentation, and many other factors to consider.
The component model popularized by React makes this work much easier than before, but often the visual and interaction design
can seems like an afterthought and leaves a lot open to interpretation.
Thankfully, userland libraries like Styled Components and Emotion have helped bring styling into a more component-based workflow.

## CSS-in-JS

While some might be skeptical of the sorts of abstractions introduced by CSS-in-JS libraries, those who embrace it find it a liberating way to author styles.
Many of the problems that you would typically encouter while working within a complex CSS codebase tend to go away when you adopt a JavaScript-based solution for managing styles.
Developers no longer have to fight specificity wars,
police pull requests for not conforming to a strict naming convention, or constantly worry about the ever-increasing size of their stylesheets.
If there's only one thing from this list that you take away,
I hope that it's this:

**If you're building an application in React, use Emotion or Styled Components for styling.**

Many others have written about these libraries, but at a very high level they:

- Allow you to author CSS that fits in perfectly with the rest of your component-based app
- Keep styles scoped to where they are intended to be used
- Allow you to publish components as packages, with no additional setup
- Avoid many of the gotchas and pitfalls of authoring CSS
- Work well with existing bundlers
- Can be used with other code splitting tools
- Can be tested with the same tools the rest of your application uses
- Have performance improvements (like critical CSS) built in, where developers don't really need to think about it

## Styled System

As the author of [Styled System][], I can't recommend it enough.
While Emotion and Styled Components give you a way to write, bundle, and use CSS, they mostly leave it up to you to decide how the styling should work.
That is, this is still CSS so beware of footguns.

Styled System is a fairly simple idea.
It transforms a theme object, built with scales and design constraints in mind, into component-based styles.
(The theme object is sort of a constraint-based schema for *design tokens*, if you will.)
It's meant to make doing the right thing easy, but also allow developers just enough flexibility to maintain a high development velocity.
With Styled System, your components have easy access to colors, font sizes, negative space scales for margin and padding, and any other visual styles that you'd like to keep consistent across your application.

Even if you've never heard of Styled System, you've likely seen it's influence on other libraries
with concepts like the `Box` component, color and other style props, or theming context that stores more than simple dark/light booleans.
Styled System is built upon a general-purpose theme specification that other libraries can and are starting to adopt.
This means that the more libraries that follow this basic idea, the more abstractions and tools can be built on top of it.

## Gatsby

Now that you have tools to build the components themselves,
you'll need a way to document them.
[Gatsby][] is an excellent tool for building applications in React, and it's an excellent choice for building documentation for applications and component libraries.
It's even used to build the official React docs themselves.
Gatsby removes a lot of the complexity involved in setting up a React application, and now with [Gatsby themes][], you can package up virtually any functionality you'd like to reuse across multiple sites.
I suspect people working in the design systems space (maybe that's you) will
come up with some interesting applications for themes.

Another use-case for Gatsby, that I haven't seen a lot of exploration of yet, is its potential as a prototyping tool.
If your production application has an API, or you want to integrate with existing data sources or services,
Gatsby has a huge ecosystem of plugins that make pulling data into your site really easy.
With the right setup, a developer could create blank templates for different parts of an application, and allow designers to build prototypes with the components from the actual design system library, but completely isolated from the production application.

## MDX

Markdown is an excellent tool for developer documentation.
[MDX][] gives markdown super powers by allowing you to import and use React components inline with other markdown content.
MDX can also be used to change what components render from markdown, which makes it super easy to build live-editable component documentation based on code blocks in your markdown.
MDX seems like an obvious choice for documenting design systems.
If you've tried out MDX in the past, but it didn't *click*, I'd highly recommend checking it out now that the stable v1 has been released.

Authoing your documentation in MDX means that it'll generally be portable enough to allow you to render it in different React applications, even if you're torn between using Gatsby and other options like [Storybook][] or [Next.js][].
Whatever you do, do *not* lock yourself into proprietary "story" formats or bend backwards for highly library-specific APIs when it comes to documentation.

## React Live

So how do you go about building live-editable code examples? React Live.
It's an excellent library on it's own, and when combined with MDX, it makes creating rich documentation for React components incredibly easy.

<!--
## Colors

There are, and always will be, many different tools for working with color. While this could quickly turn into an essay in and of itself, I'll only list a few of my favorites here.
Generally this tooling is fairly decoupled from the implementation details, but some of them are useful for generating or incorporating with documentation.

- Colorable (web & npm package)
- Contrast Swatch
- (Lyft tool)
- (Cloudflare)
-->


## Testing

Jest and React Testing Library are essentially defacto choices for testing in React, and they work super well for testing design system component libraries as well.
Both Emotion and Styled Components have excellent integrations with Jest, and I highly recommend making use of them.

Generally, I'm not a huge fan of visual regression testing, due to false positives and the additional amount of setup required.
For the most part, I think snapshot testing styled components (when done right and not used as a test-coverage escape hatch, can serve the same purpose with a lot less headache.

For more complex components, React Testing Library does a lot of things right, in particular, it can help catch certain accessibility issues before they ever make it into production. Avoid Enzyme, use React Testing Library.


[styled system]: https://styled-system.com
[emotion]: https://emotion.sh
[styled components]: https://styled-components.com
[gatsby]: https://gatsbyjs.org
[mdx]: https://mdxjs.com
[gatsby themes]: https://www.gatsbyjs.org/blog/2019-07-03-announcing-stable-release-gatsby-themes/
[storybook]: https://storybook.js.org/
[next.js]: https://nextjs.org
