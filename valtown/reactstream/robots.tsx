import { Middleware } from "./types.tsx";

/** respond to /robots.txt with a custom string */
export const robots = (txt: string): Middleware => async (req, res, next) => {
  const url = new URL(req.url);
  if (txt && url.pathname === "/robots.txt") {
    return new Response(txt, { headers: { "Content-Type": "text/plain" } });
  }
  return next();
};