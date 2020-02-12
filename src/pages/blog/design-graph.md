---
title: The Design Graph
date: 2020-02-12
---

# The Design Graph

Working on UI design and design systems for over a decade,
I've built up a vocabulary for describing some of the concepts and implementation details around working with design constraints.
Despite the many ways in which I've attempted to describe things,
it's always felt like there was a lack of language to describe the interconnected nature of all these pieces.
Talking about using *scales* as design constraints,
*themes* to codify the design language of a UI design system,
or the *component API* of a particular library has always felt too disjointed for what should be a tightly woven system.
The term *design systems* used to somewhat fill this void, however it's taken on a much larger meaning over the past few years
and tends to imply the people, organizations, and processes (among many other things), in addition to the implementation details.
So, how can we talk about the implementation details of UI design in a more precise way?
And, how can we build upon these concepts to push UI design to a higher level of abstraction?

What started out as an attempt to create a [specification][] for one piece of the puzzle,
has evolved into what I've started calling *The Design Graph*.

[specification]: https://theme-ui.com/theme-spec

## What is the Design Graph?

It's a constraint-based system for organizing styles for UI design.

- not an implementation - conceptual model
- more than the sum of its parts
- theme-ui

## What is this for?

The Design Graph is meant to help answer common questions when implementing design systems, such as:

- *What should we call this?*
- *Where should we put this?*
- *How do we use this?*

Naming things is hard.
The fewer things you need to name, the more time and energy you can spend solving more important problems for your product.
With a standard interface and naming conventions for storing raw values in your UI,
more and more tools and abstractions can be built on top of this lower-level framework.
By naming things in a consistent way, we get [*interoperability*](/blog/interoperability) for free.

Although people love to organize things, we're really terrible at doing so in a way that makes sense to others.
The Design Graph doesn't try to solve this completely, but it provides guidance for where certain aspects of your UI design should live.
Raw color values belong in the `colors` *scale*, and variations of your button styles belong in the `buttons` *variants*.

Creating sensible but flexible component APIs is hard.
When building out a library of components, it's generally beneficial to reuse props APIs across multiple components whenever possible.
This helps maintain a *minimum API surface area* and allows for a *learn once, use anywhere*

---

- Questions and Answers
- Theme UI as an implementation
- More than the sum of its parts
- Help us define what a complete design graph could look like

- What should we call this?
- Where do we put this?
- How do we use this?
- Unified theory
- Variables tend to be flat key/value pairs
- Lacks the nuance and contextually descriptive language
- Theme UI is an implementation
- Theme UI is more than the sum of its parts
- Someone could take the concept of the Design Graph, change some of the naming conventions and ruin the concept
- The Design Graph is larger than the sum of its parts
- Why? Interoperability
