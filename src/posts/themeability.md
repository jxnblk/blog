---
title: Themeability
date: 2019-07-19
---

- constraint based design
- solution space
- styled system
  - design system
  - intentionality
- components as commodity
- ikea effect
- MDX
- trifecta
- theme specification
- interoperability
- theme ui
- tooling
- generation
- automation

I've been interested in the idea of constraint-based design for a while.

By constraining the solution space for a particular problem,
new and novel ideas can emerge beyond the initial problem space.

By reducing the number of decisions one has to make,
new ideas and solutions can emerge beyond the initial problem space.

In the context of UI design,
if you don't need to decide whether a heading's font size should be 22 or 24 pixels,
you have more time to decide what that heading should say in the first place or whether there should be a heading at all.
Design constraints can help create a distraction-free environment for creative thought,
much like other tools aimed at promoting creative focus.
This can be viewed as a sort of a hierarchy of needs,
and when you can stop spending energy on the lower-level tiers,
you can start exploring higher level abstractions.

I've tried to distill some of this thinking into several different open source libraries over the years,
notably Basscss, Rebass, and Styled System.
While the approaches that libraries like Basscss and Rebass promoted were not openly embraced at first,
some of their core ideas have slowly gained traction,
and now Styled System is becoming a more-and-more common solution for applying visual constraints within component libraries and design systems.

## Styled System

Styled System is a solution for managing design constraint scales within certain domains of visual design.
By defining a typographic scale, negative space scale, color palettes, and other visual attributes in a `theme` object,
these values can be quickly applied to components where needed,
while still allowing the flexibility to override values contextually within an application.
At its core, it's a utility to create transform functions that take design system constraints and map them to components.
In a nutshell, it's **styling as a function of design constraints**.

Styled System is a fairly mature library at this point and much of the recent development has been around utilities that expand upon this core idea.
While Styled System is great for building design systems and component libraries, it's not an ideal solution in and of itself for creating white-labels or themeable user interfaces.

Styled System is completely framework-agnostic and requires the user to create their own components that integrate with other CSS-in-JS libraries.
It requires you to make intentional, up-front decisions about the component API,
which is great for corporate design systems, but shouldn't be neccessary for applying a design system in general-purpose UI development.
While it is possible, Styled System also doesn't provide much guidance for creating applications that are truly themeable.

## Components as Commodity

If you look at modern web UI development, it's easy to see the large amount of duplicative efforts across different organizations.

- Duplicative efforts
- Examples of standardization
  - HTTP
  - Linux
- Entropy of software
- Why haven't off-the-shelf solutions succeeded yet?
- We are essentially the Linotype operators of the Web.

## The IKEA effect

So why are we all still spending time, energy, and money on building what is largely the same thing?
One thing that Styled System does benefit from is [The IKEA Effect][].

> The IKEA effect is a cognitive bias in which consumers place a disproportionately high value on products they partially created.

By providing only part of the solution to building a component library, users can create something of their own.
Our primate brains trick us into thinking that our special `Box` component is unique,
when really it's not all that different from

I suspect that the emergence of design systems in recent years is the result of the IKEA effect compounded with NIH syndrome.

I suspect that corporate design systems are (at least partially) the result of the IKEA effect and NIH (not-invented-here) syndrome.
We are all biased, and it's easy to believe that the problems we're solving are completely unique and require unique solutions.

- social proof

If you have a design-system hammer, you start to see a lot of design-system-shaped nails.

[the ikea effect]: https://en.wikipedia.org/wiki/IKEA_effect
[linotype]: https://en.wikipedia.org/wiki/Linotype_machine
[maslows hammer]: https://en.wikipedia.org/wiki/Law_of_the_instrument#Abraham_Maslow

## Theming

The idea of themeable user interfaces often flies in the face of what many corporate design systems attempt to achieve,
		unless that company also has white-label products.
Most design systems are developed to ensure a consistent look and feel across 100s of designers and developers spanning different teams in an organization.
Unless that company also builds white-label products,
the odds are that they won't prioritize making interfaces themeable – and for good reason.
Even if theming a user interface is not a hard requirement,
		However, even in cases where theming a user interface is not a hard requirement,
developing components with this in mind can be beneficial nonetheless.

More and more design systems are built using third-party, open source components that handle complex logic, such as autocomplete inputs, masked inputs, date pickers, drop downs and more.
It's generally not worth the cost of developing new solutions when off-the-shelf components can be leveraged instead.
The render prop pattern has become popular in recent years to allow this logic to be wrapped up into a reusable component that doesn't actually care what the end UI looks like.
If these same components additionally offered a smart default styled version, that was completely themeable, then consumers of this component wouldn't need to build the actual rendered UI pieces at all.

In 2019, it's surprising that commoditized UI components haven't taken off more than they have.

The problem with this is that every different component has its own API and all theming APIs vary from implementation to implementation.
The only common denominator is the low-level CSS used for any web-based component, and when the entirety of CSS is available, that leads to a lot of fragmentation.
If library authors conformed to a common specification and standards for allowing UI components to be themed, then the whole ecosystem could benefit.
This is the idea being the Theme Specification.
While it's not, nor ever will be, a complete solution for theming,
it's meant to provide an unopinionated foundation for building and expanding on top of.

This theme specification is a design constraint in and of itself.

The fewer decisions that you need to make at this level of abstraction,
the more exploration you can do beyond this.

You can read more about this idea in my other post *Interoperability*.

## CSS Zen Garden

CSS Zen Garden was a fantastic idea at the time, but it's clear in hindsite that the underlying solution for creating themeable websites was not robust enough to allow the original vision to come true.
CSS was a much better abstraction than its predecessors, but it doesn't operate at a high enough level to support theming in rich, modern-day web applications.
Theming is a *very* difficult task, and one that requires a lot of buy-in and real-world experimentation.

But like any early specification,

A design-by-committee approach probably won't serve this sort of effort well.

## Material Design

Google's Material Design is probably the closest to achieving this sort of themeability to date, allowing interface developers to reuse Google's UI components but apply their own theming and branding.
Google can do this because it's a huge company with a lot of influence.
The problem with MD is that many developers do not want their interfaces to look like Google, or they have bespoke interface widgets that do not fit in well with the overall design philosophy or interaction guidelines that Google uses.
Material Design itself isn't an open source project.
While some material design-based open source projects exist,
Developers cannot easily contribute back to the core aspects of material design.
This is for good reason, and Material Design was not originally built with themeability in mind or for the same purposes.


## The Visual Design Trifecta

It's amazing how much of a visual impact you can make by changing a few values

Changing color, typography, and layout styles can make a huge impact on any given design.
While there are many other visual aspects that can affect the design language of a site,
by focusing on these three core aspects,
by focusing on these three core aspects,
Biggest bang for your buck

The visual impact you can make on any visual

Color, typography, and layout

## Effortless design systems

While some may use a more exclusive definition of the term "design system",
I think that a design system is something that can be introduced in any application, no matter how small.
A design system does not mean that you need a dedicated team or working group.
It also doesn't mean you have to build your own bespoke tooling, or have a highly polished documentation site, or have buy-in across your entire organization to reap some of the benefits that design systems can provide.

Don't boil the ocean and don't bite off more than you can chew.


## Theme UI

Theme UI is a framework for building constraint-based, themeable user interfaces and a foundation for building interoperable components.
It provides core abstractions for design-system-driven applications, without the need to create a bespoke design system from scratch.

Theming is built in, but it's applications span wider than

- Building Blocks
- IKEA effect

## Foundation for other tooling

Theme UI is in its early stages and not yet at a stable v1 release.
I hope that the core part of the library can serve as a foundation for many other design system tools and components in the future.
I can imagine a rich suite of tools, from open source component libraries, to VS Code plugins, Chrome extensions, Figma plugins, color tools, typesetting tools, and even machine learning, built on top of this low-level abstraction, where any user interface built with this can benefit.
It's a lofty dream and it'll surely be a rough ride getting there, but I'd love your help in building this vision and making it a reality.





- self-imposed limitations
- solution space

---

- Styled System
	- Typography, colors, layout
	- Geared towards component libraries
	- Does not provide guidance for creating themeable UI
	- Requires creating components and deciding on an API up-front
	- Framework-agnostic
	- requires setup with other libraries like Styled Components or Emotion
- Theme UI
	- Standard theme schema
	- Constraints
	- Trifecta
	- Hot-swappable themes
	- Change the overall look and feel of UI with a single object
	- Smart defaults
	- batteries included
- Basis for more tooling
	- Chrome extension
	- VS Code plugins
	- Figma plugins
	- Transformers for non-standard (proprietary) theming in libraries like Material UI
	- Interoperability baked in from the start

---

Aspirational

A design system for creating consistent, constraint-based user interfaces

Build better user interfaces faster


This isn't your run-of-the-mill corporate design system.
This is a design system in the 20th century sense.
The Typography, Color, & Layout trifecta
Batteries-included design system framework

Design systems without needing to build a design system

Theme UI gives you the power of a design system, without

<!--
- functional fixedness
- Maslow's hammer
- familiarity principle https://en.wikipedia.org/wiki/Mere-exposure_effect
- NIH syndrome
- status quo bias
- uniquness bias https://en.wikipedia.org/wiki/Uniqueness_bias
-->
