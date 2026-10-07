/** @jsxImportSource https://esm.sh/react@18.3.1 */
import * as React from "https://esm.sh/react@18.3.1";
import { ReactStreamProps, Middleware } from "./types.tsx";

// main react response handler
export const reactStream = (
  Component: React.ComponentType<ReactStreamProps>,
  module: string | false,
): Middleware =>
  async function(req: DataRequest, res: Response): Promise<Response> {
    const { renderToReadableStream } = await import("https://esm.sh/react-dom@18.3.1/server");

    const stream = await renderToReadableStream(
      <Component {...req.data} />,
      module
        ? {
          bootstrapModules: [module],
          bootstrapScriptContent: `window.__data=${JSON.stringify(req.data)}`,
        }
        : {},
    );
    const headers = res.headers;
    headers.set("Content-Type", "text/html");

    console.log("reactstream", res.status);
    return new Response(stream, {
      headers,
      status: res.status,
      statusText: res.statusText,
    });
  };