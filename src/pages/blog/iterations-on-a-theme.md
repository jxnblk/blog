---
title: Iterations on a Theme
date: 2019-04-06
---

As my personal GitHub account rolls over 500 repos (apparently a few of them are private), it felt like a good time to reflect on how I approach using GitHub personally.
You might say, *"500! Whoa, buddy, that's way too many repos!"* Believe me, it is.
There are other people who do a much better job at staying organized than I do.
But most of my repos aren't fully-baked open source projects.
I see a lot of them as small experiments, my attempt to *[learn in public][]*, or, for many of them, **iterations on a theme**.

It might look like I'm cranking out new things left and right sometimes,
but often I get the itch to rework an old idea,
as a complete rewrite, with no baggage attached.
There's certainly something to be said about starting with a blank slate.
I need to do a better job of managing expectations,
since a lot of these aren't intended to be hard dependencies in an application,
but serve as good starting points for forking or suggestions for features in upstream libraries.

For example, [Rebass][] (didn't invent but) included a [`css` prop][] until [styled-components][] included one as well [^1].
It also had an [`is` prop][], until it was adopted and renamed `as`.
The idea with these features was never to own these concepts forever,
but to serve as a testing bed in userland and prove out APIs that might make sense in upstream libraries,
many of which weren't mature enough for a formal PR.
Some repos and ideas fall on the other side of the fence, not being all that great, and I think were better left as experiments.

In looking back on some of these repos, I started thinking about how they've evolved over time and noticed a few overarching themes.

[repos]: https://github.com/jxnblk/?tab=repositories
[learn in public]: https://gist.github.com/sw-yx/9720bd4a30606ca3ffb8d407113c0fe5
[rebass]: https://rebassjs.org
[`css` prop]: https://github.com/jxnblk/axs/commit/b54d8527e6e19ec1177cb8894af9870a84a16962
[`is` prop]: https://github.com/rebassjs/rebass/commit/3201fd119313214c0a16b167b81e4ae9a71c2e98
[array props]: https://github.com/jxnblk/axs/commit/5996eecedf7b4b2821cd1b4f5f8fe09efa684ac9
[styled-components]: https://styled-components.com

## Static Site Generators & Zero-Config

Ever since learning about [Jekyll][] years ago,
I've been fascinated with the idea of generating simple static sites with modern tooling.
What started as a [blog post][ssg-react] about static site generation in 2015, became a [zero-config CLI][] in 2016 (appropriately named [static-react][]).
I took the same zero-config philosophy and applied it to webpack with a CLI named [hotdamn][] (it even supported markdown for content).
I was also really interested in the idea of how to make React more accessible to people who weren't JavaScript developers and made [Ejsx][].
In 2017, working with a few others, some of these ideas became [x0][] and a little later [mdx-go][].
I'll also admit that I have several private repos that generate static HTML through some means or another.
I might be a little obsessed with this idea.

[hotdamn]: https://github.com/jxnblk/hotdamn
[static-react]: https://github.com/jxnblk/static-react
[x0]: https://github.com/c8r/x0
[mdx-go]: https://github.com/jxnblk/mdx-go
[ssg-react]: https://jxnblk.com/blog/static-site-generation-with-react-and-webpack
[zero-config cli]: https://jxnblk.com/blog/zero-configuration-react-static-site-generator/
[micro-react]: https://github.com/c8r/micro-react
[ejsx]: https://github.com/jxnblk/ejsx
[jekyll]: https://github.com/jekyll/jekyll
[gatsby]: https://gatsbyjs.org
<!--
How to I loop this in without clumping it in?

I might be a little obsessed with the idea of making performant websites and making that easier,
but I guess it's only appropriate that I've ended up at a place like [Gatsby][].
(which, by the way, is *so* much more than a static site generator)
-->

## Avoiding Learning Tools

Another related theme I've pick up on, is my reluctance to use existing tools for the job at hand.
Instead of firing up Adobe Illustrator to create yet another Twitter card image or favicon,
I made [Repng][] so that I could create images with React components.
I put together [Pixo][] so that I could avoid manually converting SVG icons into React[^2].
Even [Colorable][], [Palx][], and [Monochrome][] are partly motivated by not wanting to fire up a graphics application.

A couple years ago, I put together a last-minute [presentation for a meetup][react-design-tooling], and like any good JavaScript developer,
instead of reaching for Google Slides, I rolled my own React app.
The next time someone twisted my arm to speak in front of other people,
I abstracted that out into a component library called [Redeck][].
A little later, after [John Otander][] et al. had released [MDX][], I took that slideshow presentation library and turned it into [MDX Deck][].

[repng]: https://github.com/jxnblk/repng
[pixo]: https://github.com/c8r/pixo
[colorable]: https://colorable.jxnblk.com
[palx]: https://palx.jxnblk.com
[monochrome]: https://monochrome.jxnblk.com
[react-design-tooling]: https://github.com/jxnblk/react-design-tooling
[redeck]: https://github.com/jxnblk/redeck
[john otander]: https://github.com/johno
[mdx]: https://mdxjs.com
[mdx deck]: https://github.com/jxnblk/mdx-deck


## Styling & Cheap UI

A fair chunk of my professional work has been around creating UI.
If you do that long enough, you realize there's a *ton* of ways to lower the amount of effort that requires.
I use the term **Cheap UI** when I talk about this sort of thing,
because I think ultimately the cost of what we do today will continue to approach zero in the future.
In the world of A/B experimentation and constant iteration, making UI cheaper to produce, only makes sense[^3].

In 2013, I released [Basscss][], which was largely based on principles from [Nicole Sullivan's][nicole sullivan] [OOCSS][],
[Nicolas Gallagher's][nicolas gallagher] [Suit CSS][], and a lot of discussions with [Adam Morse][].
It was my attempt to make building UI as quick and cheap as possible.
That worked well for the time, and served as inspiration for other libraries, like Buzzfeed's [Solid][].
As soon as I'd taken the time to learn React, I could tell it was the next big thing,
and I immediately tried to apply some of this same thinking in [Rebass][] and [Reflexbox][].
Rebass continued to evolve, eventually swapping out CSS for inline styles,
which made sharing components via npm even simpler.

As I continued working on Rebass, I tried out some of the cutting edge CSS-in-JS libraries of the time [Aphrodite][] and [Radium][].
For reasons I can't quite remember, neither one seemed to fit quite what I wanted.
So I started hacking on [CXS][] to try to find a simple, lightweight API for styling React components.
A *ton* of other similar libraries sprung up around the same time, including [Glamor][],
which looked considerably better than anything I would've done.
Realizing that it'd only be a matter of time until my ideal CSS-in-JS solution existed,
I continued to iterate on the higher-level component APIs that I wanted to have for building UI.
Since Rebass had matured a bit, I didn't want to rock the boat too much for people who were using the library,
and I started another blank-slate project called [Axs][].
Axs is probably one of my least popular libraries, but it's really where the inception of [Styled System][] happened.

The first version of Axs had a props API that looked a lot like Basscss.
After writing responsive styles with props like `w={1} sw={1/2} mw={1/3} lw={1/4}` for a while
(that's shorthand for `width`, `small-width`, `medium-width`, `large-width`),
I realized they could be combined into a single prop as an array, making it `width={[ 1, 1/2, 1/3, 1/4 ]}`.
This is JavaScript, after all.
I loved this API, but wasn't sure if I'd gone too far down a rabbithole.
I convinced some coworkers to try this approach out on some smaller projects (not the best thing to do, professionally),
and surprisingly, they seemed to like the API as well.

A little later, [Styled Components][] was released,
and I immediately realized it was what I wanted to use to build Rebass.
After a little more tinkering and experimentation, I released [Styled System][],
taking the props API from Axs and making it available for anyone to build their own version of Rebass.

[Nicole Sullivan]: https://mobile.twitter.com/stubbornella/
[Nicolas Gallagher]: https://github.com/necolas
[Adam Morse]: https://github.com/mrmrs
[oocss]: https://github.com/stubbornella/oocss/wiki
[suit css]: https://github.com/suitcss/suit
[basscss]: http://basscss.com
[solid]: https://solid.buzzfeed.com/
[reflexbox]: https://github.com/jxnblk/reflexbox
[rebass]: https://rebassjs.org
[cxs]: https://github.com/cxs-css/cxs
[axs]: https://github.com/jxnblk/axs
[rebass grid]: https://github.com/rebassjs/grid
[styled system]: https://styled-system.com
[aphrodite]: https://github.com/Khan/aphrodite
[radium]: https://github.com/FormidableLabs/radium
[styled components]: https://styled-components.com


## Iteration

I like reflecting on these experiments because I think it goes to show how some ideas take time to form.
As they say, *if at first you don't succeed, try, try again*.
I may be a little too quick to throw the baby out with the bathwater sometimes,
but I don't think some of the libraries that I'm most proud of would have ever existed if I hadn't continually
pushed myself to try things in new ways and get out of my comfort zone a little bit.

Hopefully, this encourages you to try new things and not worry too much if your new repo doesn't make it to the front page of Hacker News.
I know I'd love to see more experimentation and more ideas out there in this weird space we call open source.


[^1]: I think the `css` prop originated in [Glamor][], but I could be wrong.
[^2]: There are better tools for SVGs now, see [SVGR][].
[^3]: I'm not talking about robots replacing designers here. The idea here is that the level at which people think about UI and design products becomes a lot higher than what we do today. Software has a tendency to trend towards higher-level abstractions. I don't plan on learning assembly language any time soon, and the things we do today will be viewed in a similar way in the future.

[glamor]: https://github.com/threepointone/glamor
[svgr]: https://github.com/smooth-code/svgr

