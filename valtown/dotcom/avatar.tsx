// jxnblk avatar.
/** @jsxImportSource https://esm.sh/react@18.3.1 */
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.3.1/server";
import { SVGProps } from "https://esm.sh/react@18.3.1";

type AvatarProps = SVGProps<SVGSVGElement> & {
  /** hides eyes for reverse color treatment */
  reverse?: boolean;
  /** width and height */
  size?: number;
  /** sets fill */
  color?: string;
  scale?: number;
  background?: string;
};

export function Avatar({
  size = 512,
  reverse,
  color = "currentColor",
  scale = 1,
  background,
  ...props
}: AvatarProps) {
  const p = reverse ? black : path;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-24 -24 176 176"
      width={size}
      height={size}
      style={{
        display: "block",
        margin: 0,
      }}
      fill={color}
      {...props}
    >
      {style}
      {background && <rect x={-24} y={-24} width={size} height={size} fill={background} />}
      <path
        d={shape}
        transform-origin="64 64"
        transform={`scale(${scale})`}
      />
      {!reverse && (
        <path
          d={eyes}
          transform-origin="64 64"
          transform={`scale(${scale})`}
          className="reverse-hide"
        />
      )}
    </svg>
  );
}

export const path = `
  M64 0 L64 4 L76 4 L74 6 L94 14 L92 16 L104 20 L100 22 L106 28 L102 28 L106 56 Q110 62 110 70 T105 84 L96 108 C92 116 76 128 64 128 C52 128 36 116 32 108 L23 84 Q18 78 18 70 T22 56 L22 22 L26 24 L34 12 L36 16z
  M72 40 Q56 30 40 30 Q32 34 30 48 L30 48 L28 74 C28 81 37 102 38 104 C46 118 62 121 64 121 C66 121 82 118 90 104  C91 102 100 81 100 74 L99 52 L94 40 L92 42 L84 38 L84 42 L74 36

  M57 88 H71 A2 2 0 0 1 71 92 H57 A2 2 0 0 1 57 88
  M53 104 H75 A2 2 0 0 1 75 108 H53 A2 2 0 0 1 53 104

  M44 62 A5.5 5.5 0 0 0 44 73 A5.5 5.5 0 0 0 44 62
  M84 62 A5.5 5.5 0 0 0 84 73 A5.5 5.5 0 0 0 84 62
  M33.3 60.4 C34.6 57.8 37 55.9 39.7 55.2 C43 54.4 46.8 55.3 50.4 58 C51.3 58.6 52.5 58.4 53.2 57.5 C53.8 56.6 53.6 55.4 52.7 54.7 C46.8 50.5 41.8 50.5 38.7 51.3 C34.8 52.3 31.5 54.9 29.7 58.6 C29.2 59.6 29.6 60.8 30.6 61.3 C30.9 61.4 31.2 61.5 31.5 61.5 C32.2 61.5 32.9 61.1 33.3 60.4 z
  M97.7 61.9 C98.5 61.2  98.6  59.9  97.9  59.1 C94.3 55  90.1  52.9  85.4  53 C82 53  78.3  54.2  74.3  56.6 C73.3 57.2  73  58.4  73.6  59.3 C74.2 60.3  75.4  60.6  76.3  60 C79.7 58  82.7  57  85.5  57 C89 57  92.1  58.5  95  61.7 C95.4 62.2  95.9  62.4  96.5  62.4 C96.8 62.4 97.3 62.2 97.7 61.9 z
  `;

const shape = `
  M64 0 L64 4 L76 4 L74 6 L94 14 L92 16 L104 20 L100 22 L106 28 L102 28 L106 56 Q110 62 110 70 T105 84 L96 108 C92 116 76 128 64 128 C52 128 36 116 32 108 L23 84 Q18 78 18 70 T22 56 L22 22 L26 24 L34 12 L36 16z
  M72 40 Q56 30 40 30 Q32 34 30 48 L30 48 L28 74 C28 81 37 102 38 104 C46 118 62 121 64 121 C66 121 82 118 90 104  C91 102 100 81 100 74 L99 52 L94 40 L92 42 L84 38 L84 42 L74 36
  M57 88 H71 A2 2 0 0 1 71 92 H57 A2 2 0 0 1 57 88
  M53 104 H75 A2 2 0 0 1 75 108 H53 A2 2 0 0 1 53 104
`;
const eyes = `
  M44 62 A5.5 5.5 0 0 0 44 73 A5.5 5.5 0 0 0 44 62
  M84 62 A5.5 5.5 0 0 0 84 73 A5.5 5.5 0 0 0 84 62
  M33.3 60.4 C34.6 57.8 37 55.9 39.7 55.2 C43 54.4 46.8 55.3 50.4 58 C51.3 58.6 52.5 58.4 53.2 57.5 C53.8 56.6 53.6 55.4 52.7 54.7 C46.8 50.5 41.8 50.5 38.7 51.3 C34.8 52.3 31.5 54.9 29.7 58.6 C29.2 59.6 29.6 60.8 30.6 61.3 C30.9 61.4 31.2 61.5 31.5 61.5 C32.2 61.5 32.9 61.1 33.3 60.4 z
  M97.7 61.9 C98.5 61.2  98.6  59.9  97.9  59.1 C94.3 55  90.1  52.9  85.4  53 C82 53  78.3  54.2  74.3  56.6 C73.3 57.2  73  58.4  73.6  59.3 C74.2 60.3  75.4  60.6  76.3  60 C79.7 58  82.7  57  85.5  57 C89 57  92.1  58.5  95  61.7 C95.4 62.2  95.9  62.4  96.5  62.4 C96.8 62.4 97.3 62.2 97.7 61.9 z
`;

/**
 * path:
 * outer
 *
 * inner
 * nose
 * mouth
 *
 * eye
 * eye
 * eyebrow
 * eyebrow
 */

export const black = `
  M64 0 L64 4 L76 4 L74 6 L94 14 L92 16 L104 20 L100 22 L106 28 L102 28 L106 56 Q110 62 110 70 T105 84 L96 108 C92 116 76 128 64 128 C52 128 36 116 32 108 L23 84 Q18 78 18 70 T22 56 L22 22 L26 24 L34 12 L36 16z
  M72 40 Q56 30 40 30 Q32 34 30 48 L30 48 L28 74 C28 81 37 102 38 104 C46 118 62 121 64 121 C66 121 82 118 90 104  C91 102 100 81 100 74 L99 52 L94 40 L92 42 L84 38 L84 42 L74 36
  M57 88 H71 A2 2 0 0 1 71 92 H57 A2 2 0 0 1 57 88
  M53 104 H75 A2 2 0 0 1 75 108 H53 A2 2 0 0 1 53 104
`;

export const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 -24 176 176" width="768" height="768" style="display:block;margin:0;"><path d="${path}"/></svg>`;

export default async function preview(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let size: number;
  const _size = url.searchParams.get("size");
  if (_size) size = Number(_size);
  const color = url.searchParams.get("color");
  const background = url.searchParams.get("background");
  const _scale = url.searchParams.get("scale");
  let scale: number;
  if (_scale) scale = Number(_scale);

  const reverse = Boolean(url.searchParams.get("reverse"));

  const svg = renderToStaticMarkup(
    <Avatar
      size={size}
      reverse={reverse}
      color={color}
      scale={scale}
      background={background}
    />,
  );

  if (url.pathname === "/.png") {
    const { render: renderPNG } = await import("https://deno.land/x/resvg_wasm@0.2.0/mod.ts");
    const png = await renderPNG(svg);
    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}

// set reverse style via classname
const css = `
.reverse .reverse-hide {
  display: none;
}
`;
const style = <style dangerouslySetInnerHTML={{ __html: css }} />;
