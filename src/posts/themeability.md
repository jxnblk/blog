---
title: Themeability
date: 2019-07-21
---

I've been interested in the idea of constraint-based design for a while.
By constraining the solution space for a particular problem,
new and novel ideas can emerge beyond the initial problem's scope.
In the context of UI design,
when you don't need to decide whether a heading's font size should be 22 or 24 pixels,
you have more time to decide what that heading should say in the first place or whether there should be a heading at all.
Like other tools aimed at promoting creative focus,
design constraints can help create a distraction-free environment for creative thought.
Design constraints can be viewed as a sort of *[hierarchy of needs][]* –
when you stop spending energy on lower-level problems,
you can start exploring higher level abstractions in design.

[hierarchy of needs]: https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs

I've tried to distill some of this thinking into several different open source libraries over the years,
notably [Basscss][], [Rebass][], and [Styled System][].
While libraries like Basscss and Rebass were certainly not instant hits,
some of their core ideas have slowly gained traction.
And now, Styled System is becoming a more-and-more widely-used solution for applying visual design constraints within component libraries and design systems.

[basscss]: https://basscss.com
[rebass]: https://rebassjs.org
[styled system]: https://styled-system.com

## Styled System

Styled System is a solution for managing design constraint scales within certain domains of visual design.
By defining a typographic scale, negative space scale, color palettes, and other visual attributes in a *theme object*,
these values can be systematically applied to components where needed,
while still allowing the flexibility to override values contextually within an application.
Styled System provides an API to make doing the right thing easy when applying consistent styles throughout an application.
At its core, it's a suite of utilities to create functions for mapping design constraints to components,
and it helps you build a UI component library with a more consistent props API.
I like to think of it as **styling as a function of design constraints**.

Styled System is a fairly mature library at this point and much of the recent development has been focused on utilities that expand upon this core idea.
While Styled System is great for building design systems and component libraries, it's not an ideal solution in and of itself for creating white-labels or themeable user interfaces.
Styled System is completely framework-agnostic and requires the user to create their own components that integrate with other CSS-in-JS libraries.
It requires you to make intentional, upfront decisions about the overall component API,
which is great for corporate design systems, but shouldn't be neccessary for applying a design constraints in general-purpose UI development.
And, while it is possible, Styled System doesn't provide much guidance for creating applications that are truly *themeable*.

## Components as Commodity

If you look at modern web UI development, it's easy to see the large amount of duplicative efforts across different organizations.
While projects like Bootstrap and Material Design have seen a non-negligible amount of adoption,
I'm very curious as to why we, as an industry, haven't wholesale adopted off-the-shelf solutions for UI components yet.
It can *seem like* it's only a matter of time before we see a major shift towards commodification of the work we do today,
but I'm skeptical that that will ever happen.
Sometimes it feels like we, as web developers, are the [Linotype operators][linotype] of the 21st century.

[entropic]: https://en.wikipedia.org/wiki/Software_entropy
[linotype]: https://en.wikipedia.org/wiki/Linotype_machine

So why do we still spend time, energy, and money on building what is largely the same thing?
I think that Styled System and similar libraries are impacted by what is often called [The IKEA Effect][].

> The IKEA effect is a cognitive bias in which consumers place a disproportionately high value on products they partially created.

By providing primitive building blocks for creating a component library,
Styled System allows users to create custom components of their own.
I think this effect is sometimes compounded with [*Not-Invented-Here (NIH) Syndrome*][nih],
where organizations spend more time and energy on building an in-house solution when comparable off-the-shelf solutions exist.
It's fair to say that off-the-shelf UI component solutions do not and will never exist,
but if all you have is a [design system hammer][maslows hammer], you start to see a lot of design-system-shaped nails.
I suspect it will take a bit of effort to move to a higher level of abstraction.

[the ikea effect]: https://en.wikipedia.org/wiki/IKEA_effect
[linotype]: https://en.wikipedia.org/wiki/Linotype_machine
[maslows hammer]: https://en.wikipedia.org/wiki/Law_of_the_instrument#Abraham_Maslow
[nih]: https://en.wikipedia.org/wiki/Not_invented_here

## Theming

The idea of themeable user interfaces often flies in the face of what many corporate design systems attempt to achieve.
Most design systems are developed to ensure a consistent look and feel across hundreds of designers and developers spanning different teams in an organization,
and they often make assumptions about the flexibility of their outward APIs that can slow down design and development velocity,
in an effort to enforce this consistency.
Unless the product is intended for white-label applications,
organizations do not have good incentives to prioritize creating themeable interfaces.
It just doesn't make sense to spend resources on such efforts.
But, even when theming a user interface is not a hard requirement,
developing components with themeability in mind can be beneficial nonetheless.

## Themeable Components

More and more design systems are built using third-party, open source components that handle complex logic, such as autocomplete inputs, masked inputs, date pickers, and drop downs.
Components like these are available today as off-the-shelf UI components,
and it's generally not worth the cost of developing new solutions when these components can be leveraged instead.
The *[render props][]* pattern has become popular in recent years to allow this sort of logic to be packaged into reusable components
that aren't concerned with the styling of the UI.
If these sorts of components included default, styled versions that were completely themeable,
the consumers of these components wouldn't need to build the rendered UI pieces at all.

[render props]: https://reactjs.org/docs/render-props.html

The problem with this idea is that every component has its own unique API,
and all theming APIs vary from implementation to implementation.
The only common denominator is the low-level CSS used for any web-based component,
and when the entirety of CSS is available for styling,
that still leaves a huge amount of room for interpretation.
Without a standard API for theming components,
we'll never have UI components that can truly operate as *interchangeable parts*.

If even a handful of UI component libraries conformed to a common specifiation for themeable components,
these components could be installed in many different applications without the need to add custom styles.
This is the idea behind the [Theme Specification][],
which is intended to be an [unopinionated foundation](/interoperability) for other libraries to be built upon.
The success of this effort is contingent on adoption, but even with limited success,
this idea could have compounding effects on efficiencies within UI development.
**The theme specification itself is a design constraint**.

[theme specification]: https://system-ui.com/theme

## Theme UI

[Theme UI][] is a library that builds upon some of the ideas within this post.
It's a framework for building themeable and interoperable UI components based on visual design constraints.
It provides out-of-the-box visual design consistency without the need to build an entire UI component library upfront.
Like Styled System, it uses a *theme object* for applying design constraints in an application,
but unlike Styled System it doesn't require custom UI components to apply these styles.
Both Theme UI and Styled System use the same underlying theme specification,
which means if you've created components with Styled System, they should work in applications that are built with Theme UI.

The library is still fairly new, but it's intended to lay a foundation for other components, libraries, and tools to be built upon.
The more libraries that adopt this theme specification, the more the users of these libraries will benefit.
If you're looking for a better way to apply consistent visual styles,
build themeable components,
or leverage constraint-based design principles in your work,
I'd encourage you to check it out.
And, if the ideas in this post interest you, we'd love to have help building more on top of this foundation.
Check out the [Theme UI repo](https://github.com/system-ui/theme-ui) to learn more.

[theme ui]: https://theme-ui.com
[interchangeable parts]: https://en.wikipedia.org/wiki/Interchangeable_parts
