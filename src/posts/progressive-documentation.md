---
title: Progressive Documentation
created: 2018-09-01
---

# Progressive Documentation

When building out JS libraries and components, everyone knows the importance of good documentation.
Without it, good code can end up going unused, which leads to duplication.

For many libraries, markdown is an excellent format for writing docs since it's based on HTML and renders nicely in a variety of tools like [GitHub.com](https://github.com).
But markdown can fall a little short when documenting front-end UI components,
where demos and the ability to interact with a component in the browser is immensely helpful.

[MDX][] was built with some of this in mind.
It gives you the simplicity of writing markdown combined with the ability to import and use React components with JSX.
More and more tools are adding support for MDX, which helps make it a more portable format.
As more tools add support for MDX over other markdown implementations,
using MDX becomes a no-brainer for use as a documentation format.

While there are several great tools out there for creating high-quality documentation sites,
such as [Next.js][], [Gatsy][], [Docusaurus][], and [Docz][],
many of these tools require custom setup and configuration outside of your source code
and can be a distraction if you're trying to quickly create documentation for something new.

They also don't often make it easy to set up documentation to serve as a development tool.

There are also tools out there for quickly developing components in isolation,
but they use proprietary APIs and don't scale well, still requiring separate documentation as a project grows.

## Introducing mdx-go

A tool for progressive documentation

- Zero setup
- Focus on writing docs
- Portability of MDX
- Upgrade to a fully-featured solution when needed
  - mdx-docs
- Continue using mdx-go as a dev tool
  - Prototyping
  - Sandbox
  - Drafts for official docs site

Also great for

- Component demos
- Simple static sites

> Don't boil the ocean

> Choose the right tool for the job

[MDX]: https://mdxjs.com
[mdx-spectrum]: https://spectrum.chat/thread/1021be59-2738-4511-aceb-c66921050b9a
[Next.js]: https://github.com/zeit/next.js/
[Gatsby]: https://github.com/gatsbyjs/gatsby
[Docusarus]: https://github.com/facebook/Docusaurus
[Docz]: https://github.com/pedronauck/docz
[mdx-docs]: https://github.com/jxnblk/mdx-docs
[mdx-deck]: https://github.com/jxnblk/mdx-deck

---

```notes
Markdown is an excellent format for writing docs for things like CLIs and packages for Node.js, and it renders nicely in a variety of tools.
```
