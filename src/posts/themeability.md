---
title: Themeability
date: 2019-07-21
---

I've been interested in the idea of constraint-based design for a while.
By constraining the solution space for a particular problem,
new and novel ideas can emerge beyond the initial problem scope.
In a given user interface,
when you don't need to decide whether a heading's font size should be 22 or 24 pixels,
you have more time to decide what that heading should say in the first place or whether there should be a heading at all.
Like other tools aimed at promoting creative focus,
design constraints can help create a distraction-free environment for creative thought.
Design constraints can be viewed as a sort of a *[hierarchy of needs][]* –
when you stop spending energy on lower-level problems,
you can start exploring higher level abstractions in design.

[hierarchy of needs]: https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs

I've tried to distill some of this thinking into several different open source libraries over the years,
notably [Basscss][], [Rebass][], and [Styled System][].
While libraries like Basscss and Rebass were not instant hits,
some of their core ideas have slowly gained traction.
And now Styled System is becoming a more-and-more widely-used solution for applying visual design constraints within component libraries and design systems.

[basscss]: https://basscss.com
[rebass]: https://rebassjs.org
[styled system]: https://styled-system.com

## Styled System

Styled System is a solution for managing design constraint scales within certain domains of visual design.
By defining a typographic scale, negative space scale, color palettes, and other visual attributes in a *theme object*,
these values can be quickly applied to components where needed,
while still allowing the flexibility to override values contextually within an application.
Styled System provides an API to make doing the right thing easy when applying consistent styles throughout an application.
At its core, it's a suite of utilities to create functions for mapping design constraints to components.
That is, it's **styling as a function of design constraints**.

Styled System is a fairly mature library at this point and much of the recent development has been around utilities that expand upon this core idea.
While Styled System is great for building design systems and component libraries, it's not an ideal solution in and of itself for creating white-labels or themeable user interfaces.

Styled System is completely framework-agnostic and requires the user to create their own components that integrate with other CSS-in-JS libraries.
It requires you to make intentional, upfront decisions about the overall component API,
which is great for corporate design systems, but shouldn't be neccessary for applying a design constraints in general-purpose UI development.
And, while it is possible, Styled System doesn't provide much guidance for creating applications that are truly *themeable*.

## Components as Commodity

If you look at modern web UI development, it's easy to see the large amount of duplicative efforts across different organizations.
While projects like Bootstrap and Material Design have seen a non-negligible amount of adoption,
I'm very curious as to why we, as an industry, haven't wholesale adopted off-the-shelf solutions for UI components yet.
It *seems like* it's only a matter of time before we see a major shift towards commodification of the work we do today,
but I'm skeptical that that will ever happen.
I believe that software is inheritly [entropic][],
and it can sometimes feels like we are the [Linotype operators][linotype] of the 21st century.

[entropic]: https://en.wikipedia.org/wiki/Software_entropy
[linotype]: https://en.wikipedia.org/wiki/Linotype_machine

So why do we still spend time, energy, and money on building what is largely the same thing?
I think that Styled System and similar libraries are impacted by what some call [The IKEA Effect][].

> The IKEA effect is a cognitive bias in which consumers place a disproportionately high value on products they partially created.

By providing only part of the solution to building a component library, Styled System allows users to create components of their own.
I think this effect is also compounded with [*Not-Invented-Here (NIH) Syndrome*][nih],
where organizations spend more time and energy on building an in-house solution when comparable off-the-shelf solutions exist.
It's fair to say that off-the-shelf UI component solutions do not and will never exist,
but if all you have is a [design system hammer][maslows hammer], you start to see a lot of design-system-shaped nails.

[the ikea effect]: https://en.wikipedia.org/wiki/IKEA_effect
[linotype]: https://en.wikipedia.org/wiki/Linotype_machine
[maslows hammer]: https://en.wikipedia.org/wiki/Law_of_the_instrument#Abraham_Maslow
[nih]: https://en.wikipedia.org/wiki/Not_invented_here

## Theming

The idea of themeable user interfaces often flies in the face of what many corporate design systems attempt to achieve.
Most design systems are developed to ensure a consistent look and feel across hundreds of designers and developers spanning different teams in an organization.
Unless the product is intended for white-label applications,
organizations do not have good incentives to prioritize creating themeable interfaces.
It just doesn't make sense to spend resources on such efforts.
But, even when theming a user interface is not a hard requirement,
developing components with this in mind can be beneficial nonetheless.

## Themeable Components

More and more design systems are built using third-party, open source components that handle complex logic, such as autocomplete inputs, masked inputs, date pickers, and drop downs.
These do exist today as off-the-shelf UI components,
and it's generally not worth the cost of developing new solutions when components like these can be leveraged instead.
The *[render props][]* pattern has become popular in recent years to allow this sort of logic to be packaged into reusable components
that aren't concerned with the styling of the UI.
If these sorts of components could additionally offer styled versions that were completely themeable,
the consumers of these components wouldn't need to build the rendered UI pieces at all.

[render props]: https://reactjs.org/docs/render-props.html

The problem with this idea is that every different component has its own unique API,
and all theming APIs vary from implementation to implementation.
The only common denominator is the low-level CSS used for any web-based component,
and when the entirety of CSS is available for styling, that doesn't really create an API for theming.
What we need instead are UI components that can operate as *interchangeable parts*.

If a handful of UI component libraries conformed to a common specifiation for themeable components,
these components could be installed in many different applications without the need to add custom styles.
This is the idea behind the [Theme Specification][],
which is intended to be an [unopinionated foundation](/interoperability) for other libraries to be built upon.
The success of this effort is contingent on adoption, but even with limited success,
this idea could have compounding effects on efficiencies within UI development.
**The theme specification itself is a design constraint**.

<!--
The theme specification is a design constraint in and of itself
-->

[theme specification]: https://system-ui.com/theme

## Theme UI

Theme UI is a library that builds upon some of the ideas within this post.
Like Styled System, it uses a *theme object* for applying design constraints in an application,
but unlike Styled System it doesn't require UI components to be created upfront.


<!--
Theme UI is a framework for building constraint-based, themeable user interfaces and a foundation for building interoperable components.
It provides core abstractions for design-system-driven applications, without the need to create a bespoke design system from scratch.
-->

[interchangeable parts]: https://en.wikipedia.org/wiki/Interchangeable_parts
