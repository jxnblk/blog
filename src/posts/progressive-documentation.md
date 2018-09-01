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

## MDX

[MDX][] was built with some of this in mind.
It gives you the simplicity of writing markdown combined with the ability to import and use React components with JSX.
More and more tools are adding support for MDX, which helps make it a more portable format.
As more tools add support for MDX over other markdown implementations,
using MDX becomes a no-brainer for use as a documentation format.

## Documentation Tools

While there are several great tools out there for creating high-quality documentation sites,
such as [Next.js][], [Gatsby][], [Docusaurus][], and [Docz][],
many of these tools require custom setup and configuration outside of your source code
and can be a distraction if you're trying to quickly create documentation for something new.

These tools don't always make it easy to set up documentation to serve as a development tool while working on the source code.
There are other tools out there for quickly developing components in isolation,
but they use proprietary APIs and don't scale well, still requiring separate documentation as a project grows.

## Introducing mdx-go

[mdx-go][] is a development tool for **progressive documentation** built with MDX.
mdx-go is meant to be used alongside your existing tools of choice for building documentation sites.
It allows you to quickly prototype, draft docs, or build simple demos outside of a larger application.

mdx-go is built with the following goals in mind:

- Focus on writing docs, not setting up an application
- View and interact with components with zero setup or config
- Can be used alongside your source code
- Always available as a globally installed CLI
- Use the portability of MDX to document React components

## Using mdx-go

Install mdx-go as a global CLI by running:

```sh
npm install -g mdx-go
```

On any directory of `.mdx` files, run mdx-go to start a development server:

```sh
mdx-go docs/
```

Each file in the directory will have its own route, and you can create an `index.mdx` file to serve as the root.

To learn more [see the mdx-go docs][mdx-go].


## Start Simple

> Don't boil the ocean

mdx-go serves as a great starting point for writing docs.
By starting docs for a new project with mdx-go,
you can focus on writing docs immediately and
you won't be locked into proprietary APIs or build setups,
meaning that upgrading to other documentation solutions later on is easy when you're ready to.
The related [mdx-docs][] project is one way to migrate a directory of MDX files over to using Next.js.

## Protyping Environment

mdx-go also works well as a local sandbox development environment, and you can continue to use it alongside other documentation tools.
It offers static site exporting for sharing work-in-progress demos or drafts with others.


## Choose the right tool for the job

Every team is different and has different needs.
Tools like mdx-go make it easy to try things out without a lot of setup or getting locked into proprietary APIs.

## Further Reading

- [Initial MDX Proposal on Spectrum.chat][mdx-spectrum]
- [MDX docs][MDX]
- [mdx-go docs][mdx-go]
- [x0: Making React Component Development Stupid Simple](https://compositor.io/blog/x0-making-react-component-development-stupid-simple/)
- [Defining Component APIs in React](http://jxnblk.com/writing/posts/defining-component-apis-in-react/)

[MDX]: https://mdxjs.com
[mdx-go]: https://github.com/jxnblk/mdx-go
[mdx-spectrum]: https://spectrum.chat/thread/1021be59-2738-4511-aceb-c66921050b9a
[Next.js]: https://github.com/zeit/next.js/
[Gatsby]: https://github.com/gatsbyjs/gatsby
[Docusaurus]: https://github.com/facebook/Docusaurus
[Docz]: https://github.com/pedronauck/docz
[mdx-docs]: https://github.com/jxnblk/mdx-docs
[mdx-deck]: https://github.com/jxnblk/mdx-deck

---

```notes
Markdown is an excellent format for writing docs for things like CLIs and packages for Node.js, and it renders nicely in a variety of tools.
```
