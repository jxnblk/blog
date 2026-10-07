import { Middleware } from "./types.tsx";

// default middleware
export const parseURL: Middleware = async (req, res, next) => {
  const url = new URL(req.url);
  const { pathname, search } = url;
  req.data.url = url;
  req.data.pathname = pathname;
  req.data.search = search;
  req.data.searchParams = Object.fromEntries(req.data.url.searchParams);
  return next();
};