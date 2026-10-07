/** @jsxImportSource https://esm.sh/react@18.3.1 */
import { hydrateRoot } from "https://esm.sh/react-dom@18.3.1/client";
import * as React from "https://esm.sh/react@18.3.1";
import { reactStream } from "./react-stream.tsx";
import { parseURL } from "./parse-url.tsx";
import { parseHeaders } from "./parse-headers.tsx";
import { ReactStreamProps, Middleware } from "./types.tsx";

export { React };
export { robots } from "./robots.tsx";

export function render<T>(
  /** Root-level React component that renders an entire <html> element
   * including the head and body tags.
   */
  Component: React.ComponentType<ReactStreamProps>,
  /** On Val Town, use `import.meta.url` for client-side hydration */
  module: string | false,
  /** Optional middleware */
  wares: Middleware[] = [],
) {
  if (typeof document !== "undefined" && module) {
    console.log("jxnblk/reactstream");
    const props = window.__data;
    hydrateRoot(document, <Component {...props} />);
  }

  return async function handler(request: Request): Promise<Response> {
    const main = reactStream(Component, module);
    const middleware: Middleware[] = [
      parseURL,
      parseHeaders,
      ...wares.slice(),
      main,
    ].filter(Boolean);

    let res: Response = new Response();
    const req: DataRequest = Object.assign(request.clone(), { data: {} });
    req.data = {};

    const next = async (nextRes?: Response): Promise<Response> => {
      const fn = middleware.shift();
      if (nextRes) res = nextRes;
      if (!fn) return main(req, res);
      return fn(req, res, next);
    };
    return next();
  };
}

export default render;