// import * as React from 'react';
import Head from './Head';
import type { PostData } from "./types";

export default function HTML (props: PostData & {
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
