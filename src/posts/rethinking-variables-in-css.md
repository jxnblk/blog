---
title: 'Rethinking Variables in CSS'
date: 2015-05-08
crossposted:
  - https://medium.com/@jxnblk/rethinking-variables-in-css-2ffafda429a
tags:
  - css
  - variables
  - preprocessors
  - postprocessors
  - postcss
---

CSS was first introduced as a way to reduce the complexity of using inline styles and to help separate concerns. After years of ballooning stylesheets with the same values being used over and over and losing sync, CSS preprocessors introduced variables to help keep values defined in a single place. Soon [custom properties](http://dev.w3.org/csswg/css-variables/) will be part of the CSS specification, which promises a native, more robust approach than what preprocessors can do.

While variables and custom properties make updating multiple instances of the same value trivial, we often still end up with multiple instances of the same property-value definitions spread throughout a global stylesheet.

<!-- more -->

_Bear with me for a second and consider this a thought experiment…_

What if instead of repeating these definitions in our stylesheets, we treated CSS rulesets as variables? That is, instead of defining something like a color across many styles, it’s only defined once, and is used by applying classes to HTML elements —i.e. .green instead of $green. We could vastly DRY up our stylesheets while making only a minimal impact on HTML size. If you apply this idea widely enough, the entire stylesheet can become so-called critical CSS.

Effectively, this means removing complexity from stylesheets, which are global and leaky, and moving that complexity to the templating system, which is much more isolated and easier to manage.

I know that this approach has sped up the development process in my professional work and for small open source projects, and I’ve never seen any evidence that this would break down when working at scale. Though I suspect that very few have ever really attempted this, and it hasn’t been long enough to know what sort of problems this might cause over the long term.

## Is this semantic?

Yes, read this article from Nicolas Gallagher — it is the best answer to this question on the Internet: [About HTML Semantics and Front-End Architecture](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/). Classes do not affect HTML semantics, and you absolutely should use well structured, accessible, semantic HTML. Period.

## What about mixing concerns?

Web components and things like React already do this and for good reason. The CSS Zen Garden is a pipe dream. If you could actually redesign something by only editing the stylesheet, we would all be using the same template and no one would be writing any new HTML.

## Won’t this lead to a lot of classes in HTML?

If you’re concerned about this, I’m concerned about how much repetition you have in your templates. Most web projects will be utilizing some sort of templating system. Just as with any code, templates should be kept DRY. If the markup for something like a modal overlay is defined multiple times across templates, it should be consolidated to a single place. Living style guides and using a component-based system like React can help enforce this approach across a team.

## Wouldn’t there be a huge maintenance cost?

Potentially. Though, I’ve only seen a handful of similar techniques at scale, and I suspect that, if it were implemented in a sensible way, it would be far better than the technical debt we incur with current CSS practices.

## What about web components?

Web components add a whole new dimension to this dynamic by introducing style encapsulation and composability — essentially reducing utility styles to an implementation detail. I’ll try to address what that could look like in a follow-up post.

_To be continued…_

