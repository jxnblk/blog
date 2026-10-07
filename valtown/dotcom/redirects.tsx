import { match, parse, pathToRegexp } from "https://esm.sh/path-to-regexp@7.2.0";
import { DataRequest } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

const redirects = new Map();
// redirects.set("/hello-color", "https://jxnblk.io/hello-color");
redirects.set("/react-icons", "https://jxnblk.io/react-icons/");

redirects.set("/colorable", "https://colorable.jxnblk.com");
redirects.set("/colorable/*", "https://colorable.jxnblk.com");
// rebass
redirects.set("/rebass", "https://github.com/rebassjs/rebass");
redirects.set("/rebass/*", "https://github.com/rebassjs/rebass");

redirects.set("/paths", "https://jxnblk.io/paths");
redirects.set("/loading", "https://jxnblk.io/loading");
redirects.set("/loading/*", "https://jxnblk.io/loading");

redirects.set("/loading/loading-bubbles.svg", "https://jxnblk.io/loading-bubbles.svg");
redirects.set("/loading/loading-spin.svg", "https://jxnblk.io/loading-spin.svg");
redirects.set("/loading/loading-spinning-bubbles.svg", "https://jxnblk.io/loading-spinning-bubbles.svg");
redirects.set("/loading/loading-spokes.svg", "https://jxnblk.io/loading-spokes.svg");
redirects.set("/loading/loading-bars.svg", "https://jxnblk.io/loading-bars.svg");
redirects.set("/loading/loading-cylon-red.svg", "https://jxnblk.io/loading-cylon-red.svg");

redirects.set("/avatar", "https://jxnblk-avatar.web.val.run/");
redirects.set("/images/avatar.png", "https://jxnblk-avatar.web.val.run/");
redirects.set("/avatar.png", "https://jxnblk-avatar.web.val.run/");

redirects.set("/apple-touch-icon.png", "https://jxnblk-avatar.web.val.run/");
redirects.set("/favicon.ico", "https://jxnblk-avatar.web.val.run?size=32&color=white&reverse=true&scale=1.375");

redirects.set("/skullcat", "https://jxnblk.io/skullcat");
redirects.set("/skullcat/*", "https://jxnblk.io/skullcat");

redirects.set("/shade", "https://jxnblk.io/shade");
redirects.set("/shade/*", "https://jxnblk.io/shade");
redirects.set("/papercraft", "https://jxnblk.io/papercraft");
redirects.set("/papercraft/*", "https://jxnblk.io/papercraft");

redirects.set("/blog/rss.xml", "/rss.xml");

const paths = [];

redirects.forEach((val, key) => {
  paths.push({
    match: (p) => match(key)(p),
    regexp: pathToRegexp(key),
    url: val,
  });
});

const blogRedirects = [
  {
    regexp: pathToRegexp("/blog/posts/:slug"),
    base: "/blog/",
  },
  {
    regexp: pathToRegexp("/writing/:slug"),
    base: "/blog/",
  },
  {
    regexp: pathToRegexp("/writing/posts/:slug"),
    base: "/blog/",
  },
];

export default async function redirectMiddleware(req: DataRequest, res: Response, next): Promise<Response> {
  const match = paths.find(p => p.match(req.data.pathname));
  // const match = paths.find(p => p.regex.match(req.data.pathname));
  if (match) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: match.url,
      },
    });
  }
  const blogMatch = blogRedirects.find(b => b.regexp.test(req.data.pathname));
  if (blogMatch) {
    const data = blogMatch.regexp.exec(req.data.pathname);
    const slug = data[1];
    console.log("BLOG Redirect", req.data.pathname, slug);
    const url = blogMatch.base + slug;
    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
      },
    });
  }

  return next();
}


/*
  // tests
  const path = "/writing/beep";
  const m = blogRedirects.find(b => b.regexp.test(path));
  console.log(m);
  if (m) {
    const d = m.regexp.exec(path);
    const slug = d[1];
    // const keys = m.regexp.keys(path);
    console.log(d, slug);
  }
*/