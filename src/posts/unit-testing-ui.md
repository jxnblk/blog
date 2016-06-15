---
title: 'Unit testing UI'
created: '5-13-2016'
draft: true
---

I recently read
[this excellent article](http://product.voxmedia.com/2016/4/20/11458814/how-designers-can-use-unit-testing-to-build-resilient-and-happy-design-systems),
where the design team at Vox has devised a testing framework for new UI components introduced into their pattern library.
While the methods they suggest are excellent, and what I'd consider something that should be industry-standard in our field,
it got me thinking that this concept could be taken a step further.
What if designers wrote actual unit tests for UI components.
What if those tests were actually applied in user acceptance testing, A/B tests, and tested against performance metrics.

## A note on the word *component*

For the purposes of this article, everything in a UI is a component.
This includes buttons, inputs, forms, promotional modules, pages, user flows, etc.
I use the word *component* not only because this is how the underlying code is written
in libraries like React,
but also because these pieces are [composable](https://en.wikipedia.org/wiki/Composability).

From the [Wikipedia page on Composability](https://en.wikipedia.org/wiki/Composability):

> A highly composable system provides recombinant components that can be selected and assembled in various combinations to satisfy specific user requirements. In information systems, the essential features that make a component composable are that it be:
>
> - self-contained (modular): it can be deployed independently – note that it may cooperate with other components, but dependent components are replaceable
> - stateless: it treats each request as an independent transaction, unrelated to any previous request. Stateless is just one technique; managed state and transactional systems can also be composable, but with greater difficulty.

## What would a unit test look like?

This is a really contrived example of what a UI unit test could look like:

```
describe: CTA button
  context: when a user sees the button
    expect: Users should know that the button is clickable
    expect: User should be able to click the button
    expect: Conversions should be above 4%
```


