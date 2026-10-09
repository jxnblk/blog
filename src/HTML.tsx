// import * as React from 'react';
import Head from './Head';
import type { Post } from "./types";

export default function HTML (props: Post & {
  // TODO
}) {
  return (
    <html lang="en-us">
      <Head {...props} />
      <body>
        {props.tree}
      </body>
    </html>
  );
};
