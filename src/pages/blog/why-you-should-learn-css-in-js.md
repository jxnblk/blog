---
title: Why you should definitely learn how to use CSS-in-JS
date: 2019-07-20
---

From time to time, I've heard that CSS-in-JS poses a barrier to entry for some people.
Like any new software abstraction, CSS-in-JS is *intended to* abstract away some of the complexities from a lower level implementation, in this case CSS.
Abstractions are neither good nor bad, but they do require learning new things.
Using CSS-in-JS lets you style applications without needing to worry about a few of the thornier aspects of CSS,
but it doesn't replace CSS entirely,
and you still need to have a solid understanding of CSS to be successful.
You will absolutely need a solid understanding of
CSS properties, values and types, inheritance, layout, stacking context, and the box-model to be successful with CSS-in-JS.

CSS-in-JS isn't a boogieman out to destroy everything you love about CSS.
In my opinion, it can make authoring CSS far more enjoyable than any other tool I've used in the past,
and I'd encourage you to give it a shot.

If you already know JavaScript, CSS-in-JS helps remove the need to use native CSS syntax,
or deal with context switching between different languages.
For younger developers straight out of bootcamp,
this can make styling an application more accessible because there are fewer new things to learn.
I've seen this myself, and remember one former colleague gushing about how Styled Components was so much easier to use than what they'd learned in school.

If you're less familiar with JS syntax, the effect can be the total opposite,
and it can seem like too much to learn at once.
Don't get discouraged.
You can still learn how to use CSS-in-JS, and keep in mind that whatever you learn along the way will be applicable knowledge in many other situations where JS is used.
I like to think of CSS-in-JS as a potentially low-barrier way to get started with JS.

Despite what I've written here,
it can still feel like a barrier because **it _does_ require learning something new**,
but one thing that I love about software development is that I'm never bored and constantly learning.

If you're not willing to learn something new, then you probably won't like CSS-in-JS at all,
but if you do have a curious mind, I hope this post helps.

## What does CSS-in-JS do?

Most libraries are designed to:

- Let you author CSS in JavaScript syntax
- Colocate styles with components
- Take advantage of native JS syntax features
- Take advantage of anything from the JS ecosystem

## What does CSS-in-JS *not* do?

At the end of the day, you're still writing code that generates CSS, and the full power of the language is still available.
CSS-in-JS **does not** get rid of the need to understand the following:

- How styles are applied to the DOM
- How inheritance works
- How CSS properties work
- How CSS layout works

## What abstractions does CSS-in-JS provide?

CSS-in-JS libraries allow you to author styles *without* generally having to think about:

- The cascade ([**not inheritance**](/blog/the-cascade-is-not-inheritance))
- Specificity
- Naming selectors
- Enforcing naming conventions
- Linting another language
- Enforcing file structures for another language
- Additional build tools

## What you need to know

To be effective with CSS-in-JS, you'll need to have a good grasp of the following concepts:

Types in JavaScript:

- Strings
- Numbers
- Objects
- Arrays
- Boolean
- Null
- Undefined

MDN is a great resource for learning JS, and I'd highly recommend their tutorial on
[JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

To really excell with CSS-in-JS, you'll benefit from understanding the following:

- [Math operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators)
- [Logical operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)
- [Ternary operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- [Dot and bracket syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)
- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

## What other benefits does CSS-in-JS have?

- It can make dead code elimination easier to manage
- It will throw errors to help you avoid mistakes, including syntax, type, and undefined errors
- Many libraries offer support for theming
- You can use virtually *any* package from npm
- You can use ES modules and scope
- Most libraries offer ways to handle dynamic styling
- Styles are generally "scoped" to a specific component
- It's far easier to write unit tests with CSS-in-JS
- Many libraries offer performance improvements like *critical CSS* with no additional setup needed

## Where do I start?

There's certainly no one-size-fits-all answer here.

If you haven't used React before, or have less experience with JS, I'd recommend checking out the [Gatsby tutorial][].
Once you have a good grasp of the concepts laid out in the tutorial, see the guide on using [Using CSS-in-JS][gatsby css-in-js].

If you know enough React to get going on your own, I'd recommend  checking out [Styled Components][].
Then, once you've got that working, definitely check out [Emotion][].
These are the two most widely used CSS-in-JS libraries at the moment,
and between the two of them, they cover a lot of ground.

If you have any questions or thoughts on how to make this post better, please reach out to me on [Twitter][].

[styled components]: https://styled-components.com
[emotion]: https://emotion.sh
[gatsby tutorial]: https://www.gatsbyjs.org/tutorial/
[gatsby css-in-js]: https://www.gatsbyjs.org/docs/css-in-js/
[twitter]: https://twitter.com/jxnblk
