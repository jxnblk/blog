import { Middleware } from "./types.tsx";

export const parseHeaders: Middleware = async (req, res, next) => {
  req.data.headers = req.headers;
  req.data.cookie = req.headers.get("cookie");
  return next();
};