---
title: Interoperability
date: 2019-03-21
excerpt: Using standards-based approaches for UI component interoperability
---

Back in early 2013, I was working at a small startup in San Francisco called Stitch Fix, alongside Adam Morse and a handful of others.
We were designing and building out early versions of their marketing pages and some internal tools.
I had the word designer in my title, and until that point in my career, I'd not shipped much production code for work.
I learned Flash in college and taught myself HTML and CSS on the side over the years, using it for small side projects and design prototypes for user research, but had never used Git and knew next-to-nothing about JavaScript.

We were both enamored by the work that people like Nicole Sullivan and Nicolas Gallagher were doing with Object-Oriented CSS and stealing lots of ideas for what we were working on.
After we left the company, I decided to move back to the east coast and work for Kickstarter.

In late 2013, I'd taken some of the ideas Adam and I were talking about at the time, and some of the problems we were working on at Kickstarter (involving a 1MB+ CSS bundle), and released the first version of Basscss.
Around the same time, Adam released Tachyons.
We both continued to develop each project separately and never landed on a common API for the two libraries.

## Naming things is hard

In hindsight, I wish I'd pushed forward with Tachyons naming conventions, but at the time, I don't think my team would have gone for it.
I had changed `btn` to `button` because the designers & developers I worked with prefered "human readable" naming conventions.
There's nothing objectively more or less "human readable" between `btn` or `button`, but I do understand the concern and think it's valuable to side with the team your working with in situations like this.
But there's no reason Basscss, as an open source library, had to adhere to the same conventions.

The real tragedy here in the divergent naming conventions is that if you've started building an application with Basscss,
but then want to upgrade to something more fully-featured like Tachyons, you'll have to do a lot of manual work to migrate.
Essentially, HTML templates written with either of these libraries aren't as portable as if we'd used a standard syntax, for example inline styles.
Today's tools would make this a lot easier, using type checking, unit tests, and perhaps even AST parsing, but it would still create a barrier.

The **interoperability** between these two libraries suffered because
*what* they did, was different from *how* they did it.

Around the same time, Etsy adopted a similar approach with slightly different naming conventions, and as the years passed,
so did BuzzFeed Solid, GitHub Primer, and Bootstrap – and now there are other open source libraries doing the same thing with, again, new naming conventions.
I don't mean to call these projects out in a bad way – I think they took (what I think was) a good idea and made it work for their team.

## Learning from the past

The paradigm of atomic/functional/utility CSS has passed.
I don't think there are any problems left to solve in this space, and, in my opinion, Tachyons has done the best job at it.
It's still a valid approach to styling an application,
but if you're using a modern front-end stack with React,
I wouldn't recommend using a CSS library like these to build out an application.
Libraries like [Styled Components][] and [Emotion][] are tools much better suited to the job and will save you a lot of headache in the long run.

## Let's not do this again

Why am I talking about approaches to CSS from five years ago?
Call me naive, but I like to think that humans are capable of learning from their past mistakes.
A lot of modern front-end libraries are starting to settle on more standard, more interoperable APIs that help reduce lock-in.
Take React and Preact, or Styled Components and Emotion.
These libraries share virtually the same API, which means teams can easily migrate from one to another in the span of an afternoon.
This is a great thing, and it allows developers to start thinking at a higher level of abstraction.

Styled System is one small attempt at a higher level of abstraction on top of the current CSS-in-JS libraries.
It's completely decoupled from Styled Components, Emotion, and even React itself.
For the most part, Styled System uses CSS property names as React component props,
which is something that other libraries do as well and doesn't require much additional learning if you already know *some* CSS.
I think this is great.
Some libraries have even re-implemented the core of Styled System for various reasons,
which I think is fine and helps encourage exploration.

Where I see differences start to arise is at the theme definition level.
Even outside of React context-based theming, a lot of React applications will store global style constants in a common module.
Something I'm starting to notice is that there are no standard conventions for what that module contains or how its structured,
but all of them seem to be doing the same thing, in a slightly different way.

## Design System Tokens

I suspect a lot of the tooling for styling applications would benefit from having a standard theming format for storing these values.
Jina Anne pioneered the concept of *design system tokens* [^1] years ago,
and a lot of teams have successfully adopted approaches like this, which I think is fantastic.
If you're already familiar with the idea of *design system tokens*, you're one step closer to seeing the value in a standard theming format.

Design system tokens are meant to be flexible and work cross-platform, which means different teams,
different implementations, and different libraries will name things differently.
This is where this specification would fit in.
A lot of interoperability could be realized,
if we all, for example, named our color palette `colors` and named the font sizes we use `fontSizes`.
What you do beyond that and what data format you use to store these values, is up to you.
It's trivial to convert JSON to ES modules to YAML or even TOML, if that's your thing.
It's also just a data structure, so transforming between other data structures (e.g. design tools or a GraphQL API) should also be possible.
This standard also wouldn't try to solve the extremely complex problems of how to name the colors themselves.

## A Theme Specification

If I haven't lost you by now, and if this interests you,
I've started a rough idea of what this could look like here: [Theme Specification].
Imagine if the entire ecosystem of open source React UI components adhered to a common naming convention for theming,
while still allowing you to choose the CSS-in-JS library of your choice.
Any new UI component you add to your application,
could instantly pick up the values from your theme and mimic the look and feel of the rest of your application,
without needing to write any custom CSS.
I think that could be pretty cool.

~~Ultimately this specification should be completely decoupled from the Styled System library, and I can move this to a more neutral location in the near future, but this seemed like a logical place to start this discussion.~~

Let me know what you think on [Twitter](https://mobile.twitter.com/jxnblk/status/1107726037805424641)
or by [opening an issue](https://github.com/system-ui/theme-specification/issues).

[^1]: Design system tokens are a fantastic abstraction. They try to solve the problem of sharing a brand's core style values cross-platform,
    whereas this specification is (initially) primarily focused on CSS/JS development – i.e. a potential *output* from design tokens.
    Design system tokens and this theme specification should be completely compatible with each other and decoupled from one another.

[basscss]: https://github.com/basscss/basscss
[tachyons]: https://tachyons.io/
[styled system]: https://styled-system.com
[theme specification]: https://system-ui.com/theme/
[styled components]: https://styled-components.com
[emotion]: https://emotion.sh
