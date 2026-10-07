import { match, parse, pathToRegexp } from "https://esm.sh/path-to-regexp@7.2.0";
import { DataRequest } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

const proxies = new Map();

proxies.set("/hello-color", "https://jxnblk--5cf00fa000fc11f09c7e569c3dd06744.web.val.run");
proxies.set("/gifolio", "https://jxnblk--fda93ece004a11f0a8d4569c3dd06744.web.val.run");

const paths = [...proxies].map(([key, val]) => ({
  match: p => match(key)(p),
  regexp: pathToRegexp(key),
  url: val,
}));


export default async function proxyMiddleware(req: DataRequest, res: Response, next) {
  const match = paths.find(p => p.match(req.data.pathname));
  if (match) {
    // console.log(`PROXY ${req.data.pathname} >> ${match.url}`);
    const url = new URL(match.url);
    const prox = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      // redirect: "follow",
    });
    return fetch(prox);
  }

  return next();
}