---
title: Defining Component APIs in React
created: 2018-07-08
excerpt: Over the years, I’ve noticed patterns in how I tend to approach component APIs and building out applications and libraries. The following is a collection of thoughts, opinions, and advice for defining component APIs that are meant to be more flexible, composable, and easier to understand. None of these are hard-and-fast rules, but they’ve helped guide the way I think about organizing and creating components.
---

# Defining Component APIs in React

Over the years, I’ve noticed patterns in how I tend to approach component APIs and building out applications and libraries.
The following is a collection of thoughts, opinions, and advice for defining component APIs that are meant to be more flexible, composable, and easier to understand.
None of these are hard-and-fast rules, but they’ve helped guide the way I think about organizing and creating components.


## Aim for a small API surface area

Just as the React library itself aims for a [Minimal API Surface Area][],
I recommend adopting a similar mindset when it comes to defining component APIs.
The fewer new things you need to learn, the easier it is for others to know how to use the components
that you create, making them more reusable.
If someone doesn’t understand your component API, the chance that they’ll duplicate your work increases.
This idea is at the core of how I approach creating components, and I find it helpful to keep in mind as I work.


## Make things easy to find

Start with a flat directory structure and don’t prematurely organize your code base.
Humans love to organize things, but we’re also really terrible at it.
Naming things is hard enough, and by creating a directory structure around your component library,
you might end up doing more work that makes it more difficult for others to find the things you’ve done.

A single directory of components can get quite large before it becomes difficult for people to manage.
And if all the components are in a single folder,
you’ll get alphabetical ordering for free in most file-system tools,
which can help provide a more complete picture of the code base for others.


## Avoid renderThing methods

If you’ve defined a custom method in your component that starts with the word `render`,
chances are that should be its own component.
As [Chris Biscardi][renderThing] puts it, **“[It] effectively means there’s enough complexity to be worth breaking down”**.
React’s smart about when to render or not render a component,
so by splitting these out into their own components, you can help React do its job better.

```jsx
// Instead of this
class Items extends React.Component {
  renderItems ({ items }) {
    return items.map(item => (
      <li key={item.id}>
        {renderItem(item)}
      </li>
    ))
  }

  renderItem (item) {
    return (
      <div>
        {item.name}
      </div>
    )
  }

  render () {
    return (
      <ul>
        {renderItems(this.props)
      </ul>
    )
  }
}
```

```jsx
// Do this
const ItemList = ({ items }) =>
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <Item {...item} />
      </li>
    )}
  </ul>

const Item = ({ name }) =>
  <div>{item.name}</div>

class Items extends React.Component {
  render () {
    const { items } = this.props
    return <ItemList items={items} />
  }
}
```

## Split components at data boundaries

Often, components should be defined by the shape of your data.

> Since you’re often displaying a JSON data model to a user, you’ll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely.

– [Thinking in React][]

I often see people new to React attempt to replicate what I call "[Bootstrap][]" components,
that is UI components that have a visual boundary that’s not directly tied to any data structure.
React and BEM-like CSS-based components have different concerns.
Instead of creating a generic Card component that displays an image, heading, and link,
and that would require a custom props API, build components for the data that you’re displaying.
Maybe the generic Card component should be a ProductCard component that can accept the `product` object from your database.

```jsx
// Instead of this
<Card
  image={product.thumbnail}
  title={product.name}
  text={product.description}
  link={product.permalink}
/>

// Do this
<ProductCard {...product} />
```

Chances are, the specific styling that you need for the ProductCard isn’t all that reusable,
and you’ll likely only have this defined in one place in your code base.
You can follow the [Rule of Three][] in situations like this.
If you've duplicated the exact Card component structure three times in your code base,
then it’s probably worth abstracting it out into its own component.


## Avoid Apropcalypse

As [Jenn Creighton][] calls it, avoid [Apropcalypse][].
Don’t be afraid to create a new component rather than adding abritrary props and additional logic to a component.
For example, a Button component might accept props for different colors, sizes, and shapes,
but there’s not always a need to have every combination of those props available.

```jsx
// Instead of this
<Button
  variant='secondary'
  size='large'
  outline
  label='Buy Now'
  icon='shoppingBag'
  onClick={handleClick}
/>

// Do this
<SecondaryButton
  size='large'
  onClick={handleClick}>
  <Icon name='shoppingBag' />
  Buy Now
</SecondaryButton>
```

Your needs may vary, but reducing the number of custom props that any component requires is generally helpful,
and reducing the amount of logic in the render function can make the code base simpler and better-suited for code splitting.

## Use composition

Don’t reinvent `props.children`.
If you’ve defined props that take arbitrary strings of text that aren’t based on a data structure,
it’s probably better to use composition.

```jsx
// Instead of this
<Header
  title='Hello'
  subhead='This is a header'
  text='And it has arbitrary props'
/>

// Do this
<Header>
  <Heading>Hello</Heading>
  <Subhead>This is a header</Subhead>
  <Text>And it uses composition</Text>
</Header>
```

If you know React, you’ll already know the API for the composed version, and it shouldn’t require as much documentation as the former.
You might wrap the composed version into another component that **is** tied to a piece of data in your application,
but you’ll probably only need that component structure defined once in your code base.

```jsx
// This makes sense as a component since it’s based on data
const PageHeader = ({
  title,
  description
}) =>
  <Header>
    <Heading>{title}</Heading>
    <Text>{description}</Text>
  </Header>

// And ideally can be used like this
<PageHeader {...page} />
```

## Avoid boolean props for enums

It might be tempting to use [boolean props][] as a convenient way to switch between variants of a component,
but it can sometimes create a confusing API.

Take the following example:

```jsx
<Button primary />
<Button secondary />
```

What happens in the following case?

```jsx
<Button primary secondary />
```

It’s impossible to know without diving into the code base or documentation.
Instead, try the following:

```jsx
<Button variant='primary' />
```

It’s a little more typing but arguably much more readable.

## Keep props APIs parallel

Whenever possible, resuse props from other components. For example, if you’re creating a date picker, use the same props that the native `<input type='date' />` expects.
It’ll be easier to guess how it works and also easier to remember.

```jsx
// Instead of this
<DatePicker
  date={date}
  onSelect={handleDateChange}
/>

// Do this
<DatePicker
  value={date}
  onChange={handleDateChange}
/>
```

The [Styled System][] library encourages using a parallel style props API across multiple components.
For example, the `color` prop works the same for all components included in [Rebass][],
which ends up having a sort of **learn once, use anywhere** effect.

```jsx
// example from Rebass
<Box color='tomato' />
<Heading color='tomato' />
```


## Ask your teammates

These are just some of my own thoughts on how to define component APIs, and they might not suite your needs.
The best advice I can give is to talk to your teammates, create RFCs and PRs,
and try [Readme Driven Development][].
Writing React components is easy.
Creating a library of components that works well for your team is worth the time and effort to get right.


[Styled System]: https://jxnblk.com/styled-system
[Rebass]: https://jxnblk.com/rebass
[Thinking in React]: https://facebook.github.io/react/docs/thinking-in-react.html
[apropcalypse]: https://speakerdeck.com/jenncreighton/flexible-architecture-for-react-components?slide=10
[Jenn Creighton]: https://twitter.com/gurlcode
[Bootstrap]: https://getbootstrap.com
[renderThing]: https://mobile.twitter.com/chrisbiscardi/status/1004559213320814592
[Minimal API Surface Area]: https://www.youtube.com/watch?v=4anAwXYqLG8
[Rule of Three]: https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)
[Readme Driven Development]: https://ponyfoo.com/articles/readme-driven-development
[boolean props]: https://mobile.twitter.com/satya164/status/1015206655997472768
