This is a copy of the readme from the original val

---

Overengineered personal site and blog built on Val Town.

<https://jxnblk.com>

I started rebuilding my site using Val Town with the intent to create a val that would fetch static HTML and commit to a GitHub repo to host with gh-pages.
After building the site out, I found that the performance seemed good enough – at least in the US – to host it directly on Val Town.

## How it works

The old site still exists at on GitHub at [jxnblk/blog][] and includes the source markdown files, build script, and static JSON API.
I experimented with storing JSON in Val Town storage, but for now, the site imports a static JSON file for content.
This content is passed to the [App][JxnblkApp] React component that includes the entire HTML and handles routing.
The component is rendered using [ReactStream][] which can render React to stream in Val Town and hydrate the component in the browser.
For performance reasons, I'm not using React on the client, but using small [vanilla JS scripts][jxnblkioVanillaJS] to handle color modes.

ReactStream also accepts middleware, and this site uses middleware to:

- Record server analytics in Val Town [SQLite][]
- Respond to `/robots.txt`
- Handle redirects
- Generate an `/rss.xml` file
- Pass the blog content as props to the App component
- Set cache headers

The favicon, avatar image, and OG images are also built in Val Town.
The [avatar][] val exports an `Avatar` React component that's used in the site and 
exposes an image service at <https://jxnblk-avatar.web.val.run/> that accepts search parameters.
This image service is used for the site's favicon.
The [blogOGImage][] val is used to generate PNG OG images from SVG and take search parameters to make dynamic
images for each blog post.

Styling is handled by importing CSS from [JxnblkCSS][] and rendering an inline `<style>` tag in the HTML head.
I experimented with some other approaches, but this seemed to be the simplest solution.

## What's next

There are still some content issues in the markdown that need to be updated for the new site and there are likely bugs to fix.
If you spot anything, you can leave a comment on this val below.
I experimented with a few different approaches and plan to consolidate JxnblkApp and this val and clean up some of the structure of the site.

I started building out a custom [Reddit embed widget][RedditEmbed2] to help with front-end performance, but it's buggy and needs some work.
I'd also like to build a custom Val Town embed widget to add custom demo vals to future posts, but that's still a work in progress.

Let me know what you think of the site so far, and if you have any ideas on how to make this better, I'd love to hear them!

[jxnblk/blog]: https://github.com/jxnblk/blog
[JxnblkApp]: https://val.town/v/jxnblk/JxnblkApp
[ReactStream]: https://val.town/v/jxnblk/ReactStream
[SQLite]: https://docs.val.town/std/sqlite/
[avatar]: https://val.town/v/jxnblk/avatar
[blogOGImage]: https://val.town/v/jxnblk/blogOGImage
[JxnblkCSS]: https://val.town/v/jxnblk/JxnblkCSS
[jxnblkioVanillaJS]: https://val.town/v/jxnblk/jxnblkioVanillaJS

[RedditEmbed2]: https://www.val.town/v/jxnblk/RedditEmbed2