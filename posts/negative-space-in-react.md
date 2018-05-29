---
title: Negative space in react
created: 2016-08-23
draft: true
tags:
  - react
  - design
  - style
  - css
  - margin
---

> White space is to be regarded as an active element, not a passive background.
>
> – Jan Tschichold

Negative space is arguably the most important part of a visual composition.

Just as in music, the rests, breathing room, and headspace are the key players in rhythm.
Without them, you just have noise.
Similarly, negative space in design helps create the rhythm, contrast, and motion in a visual composition.

When creating visual rhythm on the web, margin and padding is the abstraction we use most commonly for negative space.
Despite its importance in the overall composition, margin isn't usually treated as a declarative equal in component based architectures.
And, because of this, it's difficult to determine whether white space belongs to the child component or the parent.

## Personal bubbles

I sometimes like to think of an element’s whitespace as it's *personal bubble*.
That is, different societies of humans have different distances at which they consider normal to keep when having a conversation.
Some cultures have much smaller personal bubbles than Americans,
and when people from these cultures visit or immigrate to the US,
americans may feel uncomfortable with how close the other person is standing to them and unconsciously back away.
Similarly, when Americans visit cultures with larger personal bubbles, the American is the one forcing others to back away.

Components obviously aren't people but they too can differ in the amount of whitespace they need,
and create interesting dynamics among the different parts of a UI.

## Approaches

There are two predominant ways of handling whitespace in component based systems.
The first involves components defining their own margins, which is how
[Rebass](http://jxnblk.com/rebass) and [Reflexbox](http://jxnblk.com/reflexbox) provide margin props.
The second involves a parent component wrapping child components with padded containers, similar to
Hugo Bessa’s [Spacing component](http://hugobessa.com.br/2016/07/20/composable-components/#layout-components).
A third, but less common approach is [Rebass‘s](http://jxnblk.com/rebass) Space component,
which declaratively creates space between other elements.

### Margin Props
Let's explore the first method where a component defines its own margins.

### Parent Layout Component

Now let's take a look at the second method, where the parent defines margins of its children.

### Space Component
Lastly, let's explore a space component that declaratively adds space between components.

<!--
- Box component is somewhere in between
- Parent spacer component in rebass
- Row, Arrange, Align,

Each has its trade offs

Declarative spacer is verbose and can be cumbersome to manage efficiently. It also destroys a convenient aspect of CSS: margin collapsing
- two elements before and after an item
- Changes based on context: inline vs block
- Desire lines from other devs, nbsp & br

Parent spacer has its own limitations
Similar to traditional CSS grid sys it doesn't allow for much flexibility
-->

### Combined Approach

We can actually devise a system that allows for all of the approaches listed above.
To start, we need a component that manages its own margin.

<!--
- HOC for other components
- It accepts m props
- Next, let's create a convenience parent wrapper
- It could work with the m prop or go lower level and apply styles
-->


