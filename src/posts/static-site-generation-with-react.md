---
title: Static Site Generation with React
date: 05-19-2015
draft: true
---

I've been dabbling with React for a few months now and love its composability and modularization.
The focus on reusablility, along with the ability to install and require componenets via npm,
shows a huge amount of potential for rapidly building application UI in a consistent way
and helping to mitigate some of the problems associated with working on larger projects.

To familiarize myself with React a little better, I've been using it on small open source projects
hosted on GitHub, and soon found myself wanting a way to build static sites.

## Why
- Percieved performance
- Enchancing a simple site
- Reusable components (your own or third party)
- Consolidated node based build system
- Data visualizations
- Client side routing
- Learning
- Fun

## How

First start a fresh project and initialize npm.

```bash
mkdir react-static-site
cd react-static-site
npm init
```

I've tried a few different combinations of modules for a build system, and I've landed on something that combines the following:
- React
- webpack
- webpack-dev-server
- jsx-loader
- static-site-generator-webpack-plugin
- react-router

```bash
npm i --sav-dev react webpack webpack-dev-server jsx-loader static-site-generator-webpack-plugin react-router
```

  Optionally:
  - cssnext
  - basscss (or tachyons or suitcss)

## 1. Set up webpack

Webpack is a module bundler similar to Browserify, but can also replace Grunt and Gulp.
I'd heard great things about webpack, and they're mostly justified, but webpack's documentation is confusing and took me a while to get it up and running.

