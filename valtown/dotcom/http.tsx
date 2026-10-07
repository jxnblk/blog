// static / vanilla js version of jxnblkio
/** @jsxImportSource https://esm.sh/react@18.3.1 */
import { match } from "https://esm.sh/path-to-regexp@8.2.0";
import React from "https://esm.sh/react@18.3.1";
import { useMemo, useState } from "https://esm.sh/react@18.3.1";

// port this to a new project
import { DataRequest, render, robots } from "https://esm.town/v/jxnblk/reactstream/index.tsx";


import { App, Route } from "./app.tsx";
import { Avatar } from "./avatar.tsx";
import redirects from "./redirects.tsx";
import { rss } from "./rss.tsx";
// import { analytics } from "./analytics.tsx";
import proxies from "./proxies.tsx";

import data from "https://blog.jxnblk.com/api/all.json?d4" with { type: "json" };

interface Params {
  slug?: string;
}

type AppCookies = {
  color?: number;
};

// TODO: try stream hydration with CDN setup
export default render(App, false, [
  // analytics,
  robots("User-agent: *\nAllow: /"),
  redirects,
  proxies,
  rss(data),
  getInitialProps,
  // cacheHeaders, // TODO: enable/CDN ??
]);

const matches = {
  home: match("/"),
  blog: match("/blog"),
  post: match("/blog/:slug"),
};

async function getInitialProps(req: DataRequest, res: Response, next): Promise<Response> {
  let params: Params = {};
  let route: Route = Route.Home;
  if (matches.post(req.data.pathname)) {
    params.slug = matches.post(req.data.pathname).params.slug;
    data.post = data.posts?.find(p => p.slug === params.slug);
    route = Route.Post;
  } else if (matches.blog(req.data.url.pathname)) {
    route = Route.Blog;
  } else if (!matches.home(req.data.pathname)) {
    route = Route.Unknown;
  }
  const { about, posts, post } = data;
  const size = JSON.stringify(posts).length;
  req.data.data = {
    posts: posts.filter(p => !p.draft),
    post,
    about,
    params,
    route,
    size,
    vanilla: true,
  };

  if (route === Route.Unknown) {
    res = new Response(null, {
      status: 404,
      headers: res.headers,
    });
    console.log("404", res);
    return next(res);
  }

  return next();
}

async function cacheHeaders(req: DataRequest, res: Response, next): Promise<Response> {
  res.headers.set("Cache-Control", "max-age=31536000");
  return next();
}

////////////////