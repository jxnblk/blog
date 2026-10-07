/** @jsxImportSource npm:react@18.3.1 */
import wrap from "npm:word-wrap";
// make this a library
import { render } from "./react-svg-to-png.tsx";
import { Avatar } from "./avatar.tsx";
import { Diagz, Tiled } from "./greebles.tsx";

const MARGIN = 64;
const FONT_SIZE = 32;
const LINE_HEIGHT = 64;

const COLOR = "white";
const BACKGROUND = "black";
const DESC = "Brent Jackson. Design engineer and aspiring indie game developer. Based in Brooklyn, NY";

function Component({ request, url }) {
  const text = url.searchParams.get("text") || DESC;
  const title = url.searchParams.get("title") || "Jxnblk";
  const color = url.searchParams.get("color") || COLOR;
  const bg = url.searchParams.get("bg") || BACKGROUND;
  const fontSize = FONT_SIZE;
  const fontWeight = "bold";
  const wrapped = wrap(text, { width: 48 });
  const lines = wrapped.split(/\n/g);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // width="300" height="160"
      width="1200"
      height="640"
      viewBox="0 0 1200 640"
      fill={color}
      style={{
        fontFamily: "monospace", // "system-ui, sans-serif",
        fontSize,
        fontWeight,
      }}
    >
      <rect
        width={1200}
        height={640}
        fill={bg}
      />
      <Tiled
        width={1200 - 64}
        height={32}
        x={32}
        y={32}
        offset={16}
      >
        <Diagz color={color} />
      </Tiled>
      <Avatar
        reverse
        color={color}
        size={256}
        y={320 - 128}
      />
      <g>
        <text
          fontSize={32}
          style={{
            fontFamily: "sans-serif",
            letterSpacing: 24,
          }}
          x={256}
          y={320 - 48}
        >
          {title.toUpperCase()}
        </text>
        {lines.map((line, i) => (
          <text
            key={i}
            x={256}
            y={(320 + LINE_HEIGHT * 0.5) + LINE_HEIGHT * i}
            fontSize={fontSize}
            fontWeight={fontWeight}
          >
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default render(Component, {
  // "Cache-Control": "max-age=86400", // 1 day
});
