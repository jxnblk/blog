---
title: The Modern Front-End Design System Stack
date: 2019-07-18
---

Design systems come in all shapes and sizes and can encompass a wide range of skillsets and roles within an organization.
As a front-end developer, I'd like to share some of the tooling
that I've found to be helpful when building out the components and code portion of a design system
in modern applications.

On more than one occasion, I've been asked what a blessed "Jackson Stack" would look like.
This list is likely to change in the future,
but the following are tools that I think are both stable and beneficial to working in design systems in 2019.
This doesn't attempt to cover every aspect of a design system,
and there is always room for experimentation and exploration,
so please take this as more of a starting point rather than a definitive list of tools to use.
Full disclosure: I've work on or with many of the tools listed in this post, and this reflects my own *personal opinions*.
Don't sweat it if you're not using any of these, this is merely one perspective on the matter.

## What do you mean by *modern*?

I use the term modern here to refer to React and related technologies.
This isn't meant to be an exclusive definition, and hopefully some of this tooling can serve as inspiration for tooling with other modern front-end libraries like Angular or Vue.js.
For the sake of pragmatism and my own personal experience,
the scope of this article will be focused on React.
If you're a full-stack Rails developer, a designer working in CSS, or someone who doesn't touch code at all,
**hopefully you can steal some ideas and apply them to the tech stack that you use professionally.**

## Components

[Everything is a component](https://jxnblk.com/blog/components/).
I've found this mode of thinking in UI development to be extremely beneficial,
and modern front-end applications are built upon functional, component-based architectures.
While React itself offers almost zero guidance on how to manage styling,
userland libraries like [Emotion][] and [Styled Components][] give you a way to author styles in a component-friendly way.

## CSS-in-JS

While some might be skeptical of the sorts of abstractions introduced by CSS-in-JS libraries,
those who embrace it find it to be a liberating way to author styles.
Many (not all) of the problems that people typically encouter while working within a complex CSS codebase tend to go away when you adopt a JavaScript-based solution for managing styles.
Developers no longer have to fight specificity wars,
police pull requests for not conforming to a strict naming convention,
or constantly worry about the ever-increasing size of their stylesheets.
If there's only one thing from this list that you take away, I hope that it's this:

**If you're building an application in React, use Emotion or Styled Components for styling.**

Many others have written about these two libraries, but at a very high level they:

- Allow you to author CSS in a component-centric way
- Allow you to add styles without needing to create (or choose names for) selectors
- Keep styles scoped and isolated to where they are intended to be used
- Allow you to publish components as packages, with no additional setup
- Work well with existing bundlers
- Can be used with standard code splitting tools
- Can be tested with the same libraries the rest of your application uses
- Have performance improvements (like critical CSS) built in, where developers don't really need to think about it

### One size fits all fits no one well

Some people advocate creating "framework-agnostic" styles, dismissing CSS-in-JS to help legitimate this ideal.
While [*write-once-use-everywhere*](https://en.wikipedia.org/wiki/Write_once,_run_anywhere) is a nice concept in theory,
I do think that being pragmatic about building a design system can be a case of
[*duplication being better than the wrong abstraction*][sandi metz].
The quality of your code base, the development speed of your team, and the end-result of the UI
can suffer from following dogma.
Do what's best for your team, and don't knock CSS-in-JS until you try it with a team working on a real product.

[sandi metz]: https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction

## Styled System

As the author of [Styled System][], I can't recommend it enough.
While Emotion and Styled Components give you a way to write, bundle, and use CSS, they mostly leave it up to you to decide *how* the styling should actually work.

Styled System is a fairly simple idea.
It transforms a theme object, built with scales and design constraints in mind, into component-based styles.
(The theme object is sort of a constraint-based schema for groups of related *design tokens* or raw style values, if you will.)
It's meant to make doing the right thing easy,
while also affording
developers just enough flexibility to maintain a high velocity.
With Styled System, your components have easy access to colors, font sizes, a space scale for margin and padding, and any other visual styles that you'd like to keep consistent across your application.
Even if you've never heard of Styled System, you've likely seen its influence in other related libraries.

## Gatsby

Once you have tools to build the components themselves,
you'll need a way to document them.
[Gatsby][] is an excellent tool for building applications in React, and it's an excellent choice for building documentation for component libraries.
It's even used to build the official [React](https://reactjs.org) docs themselves.
Gatsby removes a lot of the complexity involved in setting up a React application.
And now with the official release [Gatsby themes][], you can package up virtually any functionality you'd like to reuse across multiple sites.
I suspect people working in the design systems space will
come up with some interesting applications for themes.

Another use case for Gatsby, that I haven't seen a lot of exploration of yet, is its potential as a prototyping tool.
If your production application has an API, or you want to integrate with existing data sources or services,
Gatsby has a growing ecosystem of plugins that make pulling data into your site really easy.
With the right setup, a developer could create blank templates for different parts of an application and allow designers to build prototypes with the components from the actual design system library,
while remaining
completely isolated from the production application.

## MDX

Markdown is an excellent tool for developer documentation.
[MDX][] gives markdown super powers by allowing you to import and use React components inline with other markdown content.
You can also change what components are used to render different elements in markdown.
Many people use this feature to build live-editable code examples
with fenced code blocks.
With this level of flexibility,
MDX seems like an obvious choice for documenting design systems.
If you've tried out MDX in the past, but it didn't *click*, I'd highly recommend checking it out now that the stable v1 has been released.

Authoring documentation in MDX means that it should be portable enough to render in different React applications,
even if you're torn between using Gatsby and other options like [Docz][], [Storybook][] or [Next.js][].
Whatever you do, try to avoid locking yourself in to proprietary formats
or bending backwards for library-specific APIs when it comes to documentation.

## React Live

So how do you go about building live-editable code examples? [React Live][].
It's an excellent library on its own, and when combined with MDX, it makes creating rich documentation for React components incredibly easy.

## What about Theme UI?

If you follow my work, you may be asking how [Theme UI][] fits into the picture.
Theme UI is a much newer library, but it's built on top of the foundation of the libraries mentioned in this post.
At this point, I'm unsure how a library like Theme UI would fit in to a *corporate* design system,
but I do think it would be an excellent choice for agencies who need to build more general-purpose solutions.
If you're willing to give it a shot, let me know how it goes.

---

Hopefully this little list is helpful in some small way,
and I hope you can take some ideas here for your own design systems work.

Shoutout to the people who work on the following design systems which helped serve as inspiration for this post:

- [SproutSocial Seeds](https://sproutsocial.com/seeds/)
- [Primer Components](https://primer.style/components)
- [Artsy Palette](https://palette.artsy.net/)

[styled system]: https://styled-system.com
[emotion]: https://emotion.sh
[styled components]: https://styled-components.com
[gatsby]: https://gatsbyjs.org
[mdx]: https://mdxjs.com
[gatsby themes]: https://www.gatsbyjs.org/blog/2019-07-03-announcing-stable-release-gatsby-themes/
[react live]: https://github.com/FormidableLabs/react-live
[docz]: https://docz.site/
[storybook]: https://storybook.js.org/
[next.js]: https://nextjs.org
[theme ui]: https://theme-ui.com
[tweet]: https://mobile.twitter.com/jxnblk/status/1144666765563224064
