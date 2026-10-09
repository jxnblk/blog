import Head from './Head';
import type { Metadata } from "./types";

export default function HTML (props: {
  data?: Partial<Metadata>;
  path: string;
  children: React.ReactNode;
  // TODO
}) {
  return (
    <html lang="en-us">
      <Head {...props.data} path={props.path} />
      <body>
        {props.children}
      </body>
    </html>
  );
};
