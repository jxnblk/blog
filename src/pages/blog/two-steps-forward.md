---
title: Two Steps Forward, One Step Back
date: 2020-03-05
excerpt: TK
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
Our explorations around working with CSS-related tech-debt led to the creation of [Basscss][] and [Tachyons][] and the birth of "Atomic CSS".
These libraries inspired other design systems such as Buzzfeed's [Solid][], GitHub's [Primer CSS][], and even [Bootstrap][] eventually added more utility-centric styles.

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

## What did it fail to do?

Despite Tachyons' popularity, no single library ever took over
the industry at a level that would negate the steep learning curve involved.
This meant that not only did developers have to learn a new methodology, but also an inevitably large custom classname API.

CSS is a powerful and nuanced language, but utility CSS can never fully replace it.
Inevitably, you'll need to add one-off styles that just aren't covered by the library you're using, and there isn't always a clear way to extend what you're working with.
Without a clear way to handle things like this, developers
tend to add inconsistent hacks and append-only styles.

As a utility-based CSS library grew, so did the size of the CSS you shipped to your users,
leaving you reliant on more build tools to remove styles that weren't in use.
While it was generally better than other methodologies with regard to CSS filesize, it still wasn't ideal.

## What new problems did it create?

## Components

With the introduction of component-based UI libraries like React,
the promise of a better way to handle authoring CSS at scale was on the horizon.
After Christopher "Vjeux" Chedeau gave a talk titled [CSS in your JS][] in 2015, the React community began exploring the possibilities with combining styles with components, which resulted in a cornucopia of new libraries for authoring CSS in JavaScript.
For an excellent writeup of why you would want this, see [Sunil Pai's response to Jonathan Snook][sunil gist].

## Two steps forward

CSS-in-JS libraries help solve a lot of the same issues Utility-based CSS methodologies were focused on (and more) in a much better way.
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
Styled System abstracted these styles props into utility functions for use in libraries like [Styled Components][],
allowing you to create your own Rebass-like components.

Many teams use libraries like Styled System to create component libraries and design systems to great success.
GitHub's *Primer Components*,
Artsy's *Palette*,
SproutSocial's *Seeds*,
and Modulz's *Radix*
all use Styled System to create components that use styles defined in *themes* with a common props API.
These help teams create UI with consistent branding and design language quickly and efficiently.

## Consistency

Styled System is great for teams that have the time and resources to build out a custom component library,
but it does require some effort to start using.
Instead of *one `<Box />` to rule them all,*
many of these component libraries have their own custom versions
that require documentation, and limit [interoperability](/blog/interoperability).


---

**Utility CSS creates a subset of CSS, with a custom syntax.
Theme UI's `sx` prop is a superset of CSS that uses standard syntax.**


<!--

- Two Steps Forward, One Step Back
- I'm sorry; you're welcome examples
- Origins of atomic css
- Goes by many names: Atomic/Functional/Utility CSS
  - I've started calling it AFU CSS
  - Sounds like, "Hey, F You" CSS, which is most peoples initial reaction
  - What problems did it solve
  - Connecting elements directly to styles (avoiding selector abstractions)
  - Design Graph like constraints
  - "Readable" inline styles
  - Mitigated append-only stylesheets
- Criticism/bashing
- What it fails to do
- What new problems it creates
- How are people succeeding with Theme UI?
- A step up the ladder of abstraction
- Preventing leaks
- New Game: CSS-in-JS
  - Code splitting
  - Lazy loading
  - Single tool chain
  - Encapsulation
  - Components
  - Runtime analysis
  - Escape hatch
  - Constraints in styles, not on the CSS language
  - CSS allows for nuanced use-cases
  - "Strict mode"
  - Things kept from Atomic CSS:
    - Readability
    - In situ editing
  - Things removed:
    - Cryptic/non-standard APIs & syntax
    - Lack of interoperability
    - Separate build tooling (Sass, PostCSS, etc)
    - Learning curve
- Theme UI helps people succeed
  - Design Graph questions
  - More sophisticated tooling/ecosystem
  - Target for generative styles
  - Interoperability
  - Install and go plug-and-play
  - Don't worry about build configuration
  - Thinking in components > thinking in styles
  - Living system > static config
  - Grows with your product
  - Contextually aware styles can enable richer styling abilities
  - Styles linked to components and elements
  - Accessible color contrast checks - need the background & foreground colors for an element
- Atomic/Functional/Utility CSS is a *subset* of CSS with a custom syntax
- The sx prop is a *superset* of CSS with a standard syntax

  - Reference:
    - http://mrmrs.cc/writing/scalable-css/
    - https://gist.github.com/threepointone/731b0c47e78d8350ae4e105c1a83867d
-->

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
