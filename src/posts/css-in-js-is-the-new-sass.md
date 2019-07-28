---
title: CSS-in-JS is the New Sass
date: 2019-07-29
---

I *love* CSS. I *love* JavaScript. CSS-in-JS is like a match made in heaven.

While others have [enumerated][threepointone] some of the overall reasons people have adopted CSS-in-JS libraries,
I wanted to take a step back and think about why we even have CSS-in-JS in the first place.
And, as horrifying as it might sound,
CSS-in-JS ain't that much different from Sass.

[threepointone]: https://gist.github.com/threepointone/731b0c47e78d8350ae4e105c1a83867d

## Syntactically... Okay

When *Syntactically Awesome StyleSheet*s first hit the scene, it put many people off.
The whitespace sensitive syntax was very different from standard CSS, which ultimately made the closer-to-but-not-standard *Sassy CSS* flavor the more popular choice.

Sass was an attempt to make authoring CSS better for teams at scale.
In practice, it helped some, but a lot of the same problems that have existed
for years still exist in Sass-based projects.
The syntax and features in Sass also made it easier to generate even larger stylesheets,
without making it obvious to the author.

Userland experimentation, like Sass, is generally beneficial to standards like CSS.
Now that the innovation period in Sass has ended,
CSS itself has the *custom properties* feature, which was inspired by Sass variables.
I think this is a huge win for CSS.
Meanwhile,
some of the not-so-great features of Sass have *not* been added to CSS, which is also good.

## Problems Beget Solutions

Unfortunately, Sass didn't solve all the problems inherit in writing CSS.
Stylesheets are continuing to grow in size, causing performance and maintenance issues for teams,
and the inherent global scope in CSS can make applying styles in a large application difficult for developers who aren't world-class CSS experts.

## OOCSS/FCSS/BEM

To counteract some of these problems, we invented authoring methodologies like OOCSS, Functional/Utility-Based CSS, and BEM.
While teams might find some success in following strict rules,
approaches like these require governance, culture, and policing to remain effective over time.
If computers were only invented for one thing,
automating these sorts of processes is probably it.

I helped invent utility-based CSS,
but I wouldn't want to revert back to using it again after using the tools we have available today.
CSS-in-JS helps remove a whole class of problems that we used to struggle with, and I can't imagine having to go back to working in a large application without it.

<!--
## Alright what's so great then?

I don't want to get into all the specific features of CSS-in-JS libraries, but I think there are a few less-discussed benefits that are often overlooked.

## Typos

With CSS, you can make a typo, merge a PR, and ship broken code to production, without noticing.
If you write styles in JavaScript, nine times out of ten, it'll break if you make a mistake.
And if you're using Typescript, there are type definitions available for CSS properties to help catch even more errors.
It sounds like a silly thing that something like a linter could catch,
but I can tell you without a doubt that there are far more CSS syntax errors on the web than you might imagine.

## Unit testing

In the past, I've used browser-based tools to unit test styles, and while it did work, I never want to set something like that up again.
With CSS-in-JS libraries,
writing unit tests using the same setup you already have is an extremely elegant way to ensure that your code works as expected.
Testing your UI in a component-based application seems like table stakes at this point.

## Objects

Objects are great, in any language.
CSS rulesets are essentially objects,
but you can't merge, access, or nest rulesets in the same ways you can with objects in JavaScript.
Instead you have to use global CSS selectors and think about specificity to combine two rulesets together.
In a way, the entire stylesheet becomes a complex global object.
With media queries, you have to nest rulesets inside of other objects, rather than adding them as nested styles within the specific ruleset you're working on.

Writing styles in JS object notation feels like a no brainer to me.
You can spread objects to merge them into others.
You can create dictionaries of objects to change styles dynamically based on props.
You can use native JS math expressions as values.
You can use anything and everything available in the entire JavaScript language.
If there's a function you'd like to use for styling,
create it and publish it to npm for reuse.

## Dynamic styles

If you've ever written BEM-style CSS, you'll appreciate the props-based conventions for handling *"modifiers"* with CSS-in-JS.
Instead of shipping extra code for component variations, the styles can be generated dynamically and only loaded on pages and views that need those styles.
This all works out-of-the-box with modern bundlers, code splitting, and async rendering,
and with the ability to write functions in JavaScript,
you have a lot more options for how to handle dynamic styles.

## Colocation

Colocating styles inline with your components feels great, and it can help reduce the cognitive overhead of switching contexts between different languages.
As a bonus, dead code elimination for CSS goes hand-in-hand with your component.

## Not worrying about selectors

The ability to style an application without thinking about selectors and specificity is huge.
I can't describe how liberating this is, and you just need to see for yourself.

-->

## Give it a shot

If you're not so much of a purist that you don't mind using tools like Sass, I'd recommend trying CSS-in-JS.
Sass is its own proprietary language that requires its own build tools, syntax, and limited set of features.
With JavaScript you gain a lot of the same functionality available in Sass, but in a much more widely used language with a lot more flexibility.
If you author CSS-in-JS, you'll be strengthening your JS skills, which should be useful for all web developers.
It can be difficult to set up for someone unfamiliar with modern JS build tools,
but again, these are the same tools you'd use in any front-end application, and I think it's a worthwhile skillset to invest in.

