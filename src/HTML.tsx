import Head from './Head';
import clientJS from "./client.js" with { type: "text" };
import windGLJS from "./wind-gl.js" with { type: "text" };
import type { Metadata } from "./types";

export default function HTML (props: {
  data?: Partial<Metadata>;
  path: string;
  css: string;
  children: React.ReactNode;
  // TODO
}) {
  return (
    <html lang="en-us">
      <Head {...props.data} path={props.path} css={props.css} />
      <body>
        {props.children}
        <script dangerouslySetInnerHTML={{ __html: clientJS }} />
        <script dangerouslySetInnerHTML={{ __html: windGLJS }} />
      </body>
    </html>
  );
};
