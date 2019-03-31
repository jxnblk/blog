---
title: Components
date: 2016-06-17
---

Everything in a UI is a component.
This includes buttons, inputs, forms, promotional modules, pages, user flows, etc.
I use the word *component* not only because this is how the underlying code is written in libraries like React and Ember,
but also because pieces of a well-designed UI system should be [composable](https://en.wikipedia.org/wiki/Composability).


From the [Wikipedia page on Composability](https://en.wikipedia.org/wiki/Composability):

> A highly composable system provides recombinant components that can be selected and assembled in various combinations to satisfy specific user requirements. In information systems, the essential features that make a component composable are that it be:
>
> - self-contained (modular): it can be deployed independently – note that it may cooperate with other components, but dependent components are replaceable
> - stateless: it treats each request as an independent transaction, unrelated to any previous request. Stateless is just one technique; managed state and transactional systems can also be composable, but with greater difficulty.


## Modular & Stateless Components

```
state => ui
```

A UI system that is made up of independent stateless components is extremely flexible.
When individual pieces need to be swapped out or updated,
those changes are isolated and don’t cause other parts of a system to break.
Thinking about these components as being pure functions –
that is, the same state always produces the same output –
can help ensure composability.

> A pure function is one that exhibits the property of substitution: replacing a call with its returned value should make the program equivalent. As an example, `concat('hello', 'world')` can be substituted with `'hello world'` without changing the behavior of your program.
>
> How can we apply this to a graphical user interface? By having the function return an abstract representation of widgets (or markup) to be rendered on the screen...
>
> – [Pure UI by Guillermo Rauch](http://rauchg.com/2015/pure-ui/)

## Why is everything a “component?”

Naming things is hard, there’s no debate there, but when you start to categorize different parts of a UI into pages, views, flows, atoms, molecules, materials, or kittens, you’ve already started to undermine the concept of composability, and it probably takes more time and effort to get an entire team of people to “agree upon” your proposed naming conventions than it’s worth.

The point of this is to think about everything as an interoperable system.
You can slice and dice components in any way you see fit, and these components are likely to change and be fine tuned as a system is developed.
Premature optimization is a trap that’s easy to fall into.
Embrace the chaos as you build.
Patterns will emerge from the primordial goop of UI that is your product,
and by consistently thinking about a composable system you’ll probably come up with something more flexible
and more robust than if one person dictates a dogmatic framework to work within.

