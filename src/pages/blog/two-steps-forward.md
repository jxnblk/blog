---
title: Two Steps Forward, One Step Back
date: 2020-03-06
excerpt: Building UI with design constraints from utlity CSS to CSS-in-JS
draft: true
---

If you've ever seen code that looks like this, I'm sorry:

```html
<div class="p3 bold white bg-blue">
  I'm sorry
</div>
```

If you've ever seen code that looks like this, you're welcome:

```jsx
<Box
  padding={3}
  fontWeight='bold'
  color='white'
  bg='blue'>
  Hello
</Box>
```

Back in 2013, [Adam Morse][] and I were following along the incredible work that [Nicole Sullivan][] and others like [Nicolas Gallagher][] were doing with Object-Oriented CSS (OOCSS).
Our explorations around working with CSS-related tech-debt led to the creation of [Basscss][] and [Tachyons][] and the birth of "Utility CSS".
These libraries inspired other design systems such as Buzzfeed's [Solid][] and GitHub's [Primer CSS][]. Even [Bootstrap][] eventually added more utility-centric styles.

This methodology became known by many names, including *Atomic CSS*, *Functional CSS*, and *Utlity CSS*,
but I've started referring to it as *Atomic/Functional/Utility CSS* or AFUCSS.
This sort of sounds like *Hey, F you!*, which is a pretty [typical response](https://medium.com/buzzfeed-design/how-i-learned-to-stop-worrying-and-love-the-atomic-class-98d6ccc45781#.yqnsfkbx2) when most people first encounter this flavor of CSS.

## What problems did this solve?

Whatever your opinion on this methodology was, it tended to help with a few common problems of working with CSS at scale.

- It connected elements directly to styles, avoiding selector abstractions and the need to name things.
- It encouraged designers and developers to use scales and constraints on margin, padding, font sizes, colors, and other properties.
- It helped mitigate "append-only" stylesheets by reusing styles.
- It avoided some of the pitfalls of "specificity wars" incurred by the cascade.
- Although it had a learning curve, once you had internalized one of the many implementations, it could increase your development velocity.

Around the same time, we started working on [CSS Stats][],
which helped validate some of our hypotheses about CSS filesize and front-end performance.
Applying this methodology to production web applications at the time helped shave of hundreds of kilobytes of CSS that was being shipped to end users.

## What did it fail to do?

Despite Tachyons' popularity, no single library ever took over
the industry at a level that would negate the steep learning curve involved.
This meant that not only did developers have to learn a new methodology, but also an inevitably large custom classname API.

CSS is a powerful and nuanced language, but utility CSS can never fully replace it.
Eventually, you'll need to add one-off styles that just aren't covered by the library you're using, and there isn't always a clear way to extend what you're working with.
Without a clear way to handle things like this, developers
tend to add inconsistent hacks and append-only styles.

As any utility-based CSS library grows, so does the amount of CSS you ship to your users,
leaving you reliant on more build tools to remove styles that you were never going to use in the first place.
While it was generally better than other methodologies at the time with regard to CSS filesize, it still wasn't ideal.

It's also worth noting that this methodology was created before React was released
and was intended for use in template-based user interfaces, including Rails and PHP.
It was never designed for functional component-based UI and doesn't take advantage of this new paradigm.

## Components

With the introduction of component-based UI libraries like React,
the promise of a better way to handle authoring CSS at scale was on the horizon.
After Christopher "Vjeux" Chedeau gave a talk titled [CSS in your JS][] in 2015, the React community began exploring the possibilities of combining styles with components, which resulted in a cornucopia of new libraries for authoring CSS in JavaScript.
For an excellent writeup of why you would want to do this, see [Sunil Pai's response to Jonathan Snook][sunil gist].

## Two steps forward

CSS-in-JS libraries help solve a lot of the same issues Utility-based CSS methodologies were focused on (and more) in a *much* better way.
They connect styles directly to elements without needing to name things or create abstractions in class selectors.
They avoid append-only stylesheets with encapsulation and hashed classnames.
These libraries work with existing build tools, allowing for code splitting, lazy loading, and dead code elimination with virtually zero effort,
and they don't require additional tools like Sass or PostCSS.
Many libraries also include CSS performance optimizations, such as *critical CSS*, enabled by default so that developers don't need additional tooling or even need to think about them.

No wonder people have been raving about this.

Another great thing about CSS-in-JS libraries, is that they're based on standard CSS syntax, properties, and values.
They remove the need for cryptic, non-standard APIs and dramatically reduce the barrier to entry when compared to utility-based CSS.

## One step back

While CSS-in-JS libraries help with a lot of issues,
some of the key benefits to libraries like Basscss and Tachyons
got lost in the mix.
Instead of using design constraints to define styles, developers are left with open-ended tools that tend to encourage one-off styles.
The learning curve was reduced, but developers were left with more choices to make.

## A new system

With the new ecosystem of CSS-in-JS libraries, I began exploring
ways to incorporate design constraints in components.
This resulted in [Rebass][] in 2015, then [Styled System][] in 2017.
Rebass introduced the notion of using style props that mapped to commonly used CSS properties and was an early attempt at recreating some of the developer ergonomics from Basscss.
Styled System abstracted these style props into utility functions for use in libraries like [Styled Components][],
allowing you to create your own Rebass-like components.
Rather than applying a mixed bag of classnames to a component, Styled System promotes *style as a function of props* with a sort of *learn-once-use-everywhere* API.

Many teams use libraries like Styled System to create component libraries and design systems to great success.
*[Chakra UI][]*,
GitHub's *[Primer Components][]*,
Artsy's *[Palette][]*,
SproutSocial's *[Seeds][]*,
and Modulz's *[Radix][]*
all use Styled System to create components that use styles defined in *themes* with a common props API.
These help teams efficiently build UI with consistent branding and a common design language.

[chakra ui]: https://chakra-ui.com
[primer components]: https://primer.style/components/
[palette]: https://palette.artsy.net/
[seeds]: https://seeds.sproutsocial.com/
[radix]: https://radix.modulz.app/

## Outside the `<Box />`

Styled System is great for teams that have the time and resources to build out a custom component library,
but it does require some effort to start using.
Instead of *one `<Box />` to rule them all,*
many of these component libraries have their own custom versions
that require documentation, and limit [interoperability](/blog/interoperability).
How can the concepts encoded in libraries like Styled System and the component libraries it powers be extended to designers and developers without the resources to build a custom component library,
while making it even easier for large teams to take advantage of network effects in the ecosystem?
No one wants another off-the-shelf component library, do they?

## The Design Graph

Instead of building *yet another* component library, what would a framework for styling modern component-based applications look like?
Leveraging the concepts of a [*Design Graph*](/blog/design-graph), design constraints, and a standard [theme specification][] for other library authors to follow,
[Theme UI][]
is the next step up this ladder of abstraction.

Although it's loosely based on similar concepts from utility CSS methodologies,
Theme UI gets rid of the cryptic, non-standard APIs and syntax, the lack of interoperability, the need for separate build tools, and the steep learning curve found in libraries like Tachyons.
It keeps the coupling of styles to elements, readability, developer ergonomics of making changes in situ,
and adds a more powerful constraint-based system for managing styles.

## A superset of CSS-in-JS

Rather than memorizing hundreds of class selectors that only represent a subset of the CSS language, or a handful of style props, Theme UI gives you a superset of CSS that can be applied to any element with its `sx` prop.
Theme-based values can be applied to common CSS properties for things like typography, color, and layout, and any bespoke, one-off styles can be added where needed, serving as an *escape hatch*.

**Utility CSS creates a subset of CSS, with a custom syntax.
The `sx` prop is a superset of CSS that uses standard syntax.**

Naming things is hard, and the `sx` prop lets you style any application without needing to name things like class selectors and components. As my friend and colleague [John Otander][] puts it,
*"Fuck naming shit when you don’t have to."*


## Don't take my word for it

Tons of people are already taking advantage of the *Design Graph* with Theme UI
to build themes, applications, and other tools.

- [Docz][] uses Theme UI to let you customize the styles for your documentation site.
- [Flex][] is a markdown/MDX based page builder that uses Theme UI for theming.
- [Novela][] is a beautiful Gatsby theme for blogging, built with Theme UI.
- [Hack Club][] connects you to high school hackathons and is styled with Theme UI.
- Plus a [whole lot more][tweet]

If you've built something with Theme UI, I'd love to hear about it.

[docz]: https://docz.site
[flex]: https://flex.arshad.io/
[novela]: https://novela.narative.co/
[hack club]: https://hackathons.hackclub.com/
[tweet]: https://twitter.com/jxnblk/status/1235658542306246657

## Demand better

If you're building an application with React in 2020,
don't settle for CSS methologies from 2013.
Demand more for your team,
and help me build the future of styling for the Web.

---

**Further reading:**

- [CSS and Scalability](http://mrmrs.cc/writing/scalable-css/)
- [Patterns for Style Composition in React](/blog/patterns-for-style-composition-in-react/)
- [Functional Programming, CSS, and your sanity](https://jon.gold/2015/07/functional-css/)
- [Styling themes](https://johno.com/styling-themes/)
- [Guessable](https://johno.com/guessable/)

*Thanks to [John Otander][] and [Diana Mounter][]*

[adam morse]: https://twitter.com/mrmrs_
[nicole sullivan]: https://mobile.twitter.com/stubbornella/
[nicolas gallagher]: https://github.com/necolas
[basscss]: https://basscss.com
[tachyons]: https://tachyons.io
[solid]: https://solid.buzzfeed.com/
[primer css]: https://primer.style/css/
[bootstrap]: https://getbootstrap.com
[sunil gist]: https://gist.github.com/threepointone/731b0c47e78d8350ae4e105c1a83867d
[css in your js]: https://vimeo.com/116209150
[rebass]: https://rebassjs.org
[styled system]: https://styled-system.com
[theme ui]: https://theme-ui.com
[styled components]: https://styled-components.com
[css stats]: https://cssstats.com
[theme specification]: https://theme-ui.com/theme-spec
[john otander]: https://twitter.com/4lpine
[diana mounter]: https://twitter.com/broccolini


<!--
- Reference:
  - http://mrmrs.cc/writing/scalable-css/
  - https://gist.github.com/threepointone/731b0c47e78d8350ae4e105c1a83867d
  - https://mobile.twitter.com/chantastic/status/1227262007469981703
- From Johno
  - tech debt was measurable in CSS Stats - data-driven
  - theming is an afterthought in most css-in-js libs
  - style as a function of props (not a mix of classnames)
  - theme-ui avoids the need to name things (selectors, components)
  - "Fuck naming shit when you don’t have to"
- Theme UI things
  - https://mobile.twitter.com/samjbmason/status/1235537136335622145
  - https://theme-ui-gallery.netlify.com/
  - https://mobile.twitter.com/gill_kyle/status/1212508600007938048
  - https://mobile.twitter.com/PaulieScanlon/status/1234434804885655554
  - https://mobile.twitter.com/dandenney/status/1233123707654148096
  - https://gatsby-theme-terminal.netlify.com/
  - https://mobile.twitter.com/atav1k/status/1230780663047036928
  - https://mobile.twitter.com/atav1k/status/1228481206813020161
  - Docz
  - Narative Novela
  - Flex: https://flex.arshad.io/
  - https://mobile.twitter.com/tuistio/status/1235658946540601345
-->
