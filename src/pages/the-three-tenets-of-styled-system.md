---
title: The Three Tenets of Styled System
date: 2019-01-28
draft: true
---

# The Three Tenets of Styled System

I released [Styled System][] around a year and a half ago,
and since then, the library has been growing steadily
and has even resulted in a few copycat libraries that use some of the same conventions.
Up until now, I haven't really written much about the thinking behind the library, but have relied more on my approach of *show, don't tell*[^1].
And while this library is certainly an iteration on a theme[^2]
(those who have followed me for years may have a clear idea what it is meant for),
I'd like to expand on what I think makes Styled System really great.

## Three Tenets

At its core, Style System is really intended to enable developers to achieve these three things:

1. Style consistently with a global theme
2. Respond to changing requirements quickly
3. Create mobile-first responsive layouts with ease

It's not meant to solve every styling problem out there,
but it is focused on some of the issues I've noticed over the years for diverse teams working on codebases where developers and designers may have varying levels of expertise with CSS and other technologies.
I have a huge amount of respect for developers who focus on CSS and who strive to understand the intricacies of an ever-growing specification, but in my experience, it's far more likely that developers are focused on other parts of the Web stack and generally know just enough CSS to be dangerous.
I don't think that means that CSS should be completely abstracted away,
but I do think there is opportunity for creating powerful abstractions that *make it easy to do the right thing*[^3]. Styled System is meant to be just one such abstraction.

## Consistency

Consistency is the bedrock of any constraint-based design or design system effort.
It goes hand-in-hand with software development principles like *Don't Repeat Yourself* (DRY)
and the general idea of abstraction.
With modern tooling like CSS-in-JS it's never been easier to ensure that values are type safe and that styles are consistent to a certain degree.

Styled System takes advantage of some of these capabilities and attempts to help teams bake this consistency in by default.
A hard-coded font size or color value in a code review is easy to smell,
and developers naturally opt-in to keeping values stored in a globally shared theme object.

## Responding to Change

Consistency is great, but I've never seen a product stabilize to the point of allowing consistency to happen on its own.
Developers are frequently working in short sprint cycles to finish tasks that likely didn't account for styling consistency when they were estimated.
Over time this leads to technical debt and parts of the CSS code base quickly become obsolete pieces of legacy code.

Styled System tries to balance the consistency provided by the core theme object with the reality that developers will constantly need to make one-off changes to ship features.
By putting *some* of the styling control into a component's props,
developers can keep these one-off changes isolated to the parts of the code base where they are used.
If a message component *really* needs to have a 13px font size, you can put that magic number directly in the component that needs it, and when that component is deleted, the magic number is gone as well.

## Mobile-First

While Responsive Web Design[^4] is nearly a decade old, and we've been designing for mobile devices for some time now, there still aren't clear best practices for how developers should approach these design concepts.
Styled System includes an opinionated syntax for how to style things responsively that's meant to
help shape the way people think about designing for mobile devices.
Instead of burying conditionals for a single CSS property across multiple media query blocks,
Styled System uses an [array syntax][] to force developers into thinking how a singular dimension, such as font size or width, should change from one breakpoint to the next.
This syntax is probably the most contentious part of Styled System, and I've been pleasantly surprised at how quickly I've seen people pick this up and how popular it's become.

```css
/* example in CSS */
.thing {
  font-size: 16px;
  width: 100%;
}
@media screen and (min-width: 40em) {
  font-size: 20px;
  width: 50%;
}
@media screen and (min-width: 52em) {
  font-size: 24px;
}
```

```jsx
// example with Styled System
<Thing
  fontSize={[ 16, 20, 24 ]}
  width={[1, 1/2]}
/>
```

A year and a half later,
Styled System has turned out to be far more well received than I ever would have expected,
and I've learned a tremendous amount from seeing how other people have taken the core concepts within it in different directions.
It may not be a good fit for every team out there, but I hope to see more explorations
into how we can build more powerful abstractions on top of CSS to keep pushing the Web platform forward.

---

A lot of the ideas within Styled System come from the people I've learned from over the years.
Thanks to:
Nicole Sullivan, Nicolas Gallagher, Jonathan Snook, Adam Morse, John Otander, Diana Mounter,
Jon Gold, Anh-Thư Huỳnh, Alex Mykyta, John Polacek,
and all the [Styled System contributors](https://github.com/styled-system/styled-system/graphs/contributors) and users.


[^1]: I find some things difficult to put into words, especially when it's a newer idea, and think that, just like a picture is worth a thousand words, showing code can be a much more powerful way to express an idea in some cases.
  See also: [Show, don't tell](https://en.wikipedia.org/wiki/Show,_don%27t_tell)
[^2]: I plan to expand on this in another post - see also [Basscss](https://github.com/basscss/basscss/), [Reflexbox](https://github.com/jxnblk/reflexbox), [Rebass](https://rebassjs.org), [Axs](https://github.com/jxnblk/axs/tree/v1.0.0)
[^3]: Needs citation
[^4]: [Responsive Web Design](https://alistapart.com/article/responsive-web-design)

[styled system]: https://styled-system.com
[array syntax]: https://styled-system.com/responsive-styles

