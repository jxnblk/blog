---
title: The Cascade is Not Inheritance
date: 2019-07-20
excerpt: On more than one occasion, I've heard people conflate the cascade feature of CSS with inheritance.
---

On more than one occasion, I've heard people conflate the *cascade* feature of CSS with *inheritance*.
While it's an understandable thing to mix up because they are, in fact, related,
I think it's important to use the correct terms when talking about technology like this.

## Inheritance

*Inheritance* is when a child element inherits styles from one of its parent elements.
Some (not all) CSS properties will automatically apply as a *default value* for child elements.
This allows you to set a font family and color at the top level of a page
and have all elements within that page use the same styles.
Very cool.

## The Cascade

The *Cascade* is the set of rules that a browser uses to determine which particular styles should apply to a given element,
when there are conflicting rules.
This is, in my mind, the trickiest part of the CSS language and it trips people up all the time.

The algorithm specified in CSS takes the following into consideration when applying styles:

- [Origin and Importance](https://www.w3.org/TR/css-cascade-3/#cascade-origin), which includes author, user agent, and user stylesheets
  1. Transition declarations
  2. Important user agent declarations
  3. Important user declarations
  4. Important author declarations
  5. Animation declarations
  6. Normal author declarations
  7. Normal user declarations
  8. Normal user agent declarations
- [Specificity](https://www.w3.org/TR/css-cascade-3/#cascade-specificity), which is [calculated based on selectors](https://www.w3.org/TR/selectors/#specificity-rules)
- [Order of Appearance](https://www.w3.org/TR/css-cascade-3/#cascade-order), which means the last declared rule wins

This quote from [MDN's Introduction to CSS: Cascade and Inheritance][mdn] sums it up pretty well:

> If you didn't fully understand the cascade, specificity, and inheritance, then don't worry! This is definitely the most complicated thing we've covered so far in the course, and is something that even professional web developers sometimes find tricky.

[mdn]: https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Cascade_and_inheritance
[specificity wars]: https://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/
