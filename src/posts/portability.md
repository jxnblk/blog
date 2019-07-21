---
title: Portability
date: 2019-07-22
draft: true
---

In software development, formats help ensure that content and data are portable and can be used in many different applications.
By adhering to HTML standards set by the WHATWG and W3C, browsers created by different organizations
can render HTML documents created by many different people and generated in many different ways.
While HTML is certainly one of the most successful examples of standardization ever,
less widely used formats can still benefit from the same idea.

Take Markdown as an example.
It was created in 2004 by John Gruber and Aaron Swartz, and today is the de facto format for writing software documentation.
It isn't widely used outside the field of software development,
but there are many different engines that can render this format into HTML.
Markdown has become a somewhat portable format.
By writing documentation, blog posts, or wiki pages in this format,
you can be fairly certain that there will always be tools that can render this format in the future.

Markdown was intended to be *easy-to-read and easy-to-write*, and can be viewed as a simplified abstraction on top of HTML.
A complete HTML page cannot be replaced by Markdown, but all Markdown files can be written as HTML.
Most people find markdown simpler to read and write than raw HTML, and prefer using it for things like blog posts and documentation.

In the same way that Markdown has found a niche in certain contexts for authoring HTML,
I'm very interested in taking this idea and applying it to CSS.
*"But, CSS is already easy to read and write,"* you might say.
Sure, but when I'm considering which styles differ the most across different interfaces and which styles make the biggest impact,
I'm mostly concerned with three things: *color*, *typography*, and *layout*.
Authoring an entire stylesheet to apply styles like this can require some effort,
and the end result isn't as portable as you might think.
Simply copying a stylesheet from one website to another does not guarantee that the styles will be applied the way you intend them to be.
A lightweight abstraction for this sort of thing, however, could make these sorts of styles more portable.

Unlike Markdown, I do not think this requires inventing new syntax.
Among CSS, JavaScript, JSON, YAML, and others, there are already plenty of tools that can parse existing syntaxes.
This does require a specific schema shape to be successful,
and the [Theme Specification][] is meant to be a simpler way to write styles for an application.
While [Theme UI][] (which is built with the Theme Specification) *can* output stylesheets in the form of [Tachyons](https://theme-ui.com/css/tachyons) and other similar CSS libraries, it cannot fully replace CSS on its own.
It does provide a level of portability for sets of colors, typographic styles,
and other design constraints that can be applied in many different places.
As the number of libraries that follow this Theme Specification increases,
you will be able to reuse these styles in more and more places.


[theme specification]: https://system-ui.com/theme
[theme ui]: https://theme-ui.com

