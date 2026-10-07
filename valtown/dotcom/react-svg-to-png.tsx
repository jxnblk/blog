/** @jsxImportSource npm:react@18.3.1 */
import { render as renderPNG } from "https://deno.land/x/resvg_wasm@0.2.0/mod.ts";
import { renderToStaticMarkup } from "npm:react-dom@18.3.1/server";

type SVGComponentProps = {
  request: Request;
  url: URL;
};

const cache = new Map();

export function render(Component: React.ComponentType<SVGComponentProps>, headers: any = {}) {
  return async function(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const svg = renderToStaticMarkup(<Component request={req} url={url} />);
    console.log(svg);
    const png = await renderPNG(svg);

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        ...headers,
      },
    });
  };
}

export default render;
