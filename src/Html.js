import * as React from 'react';
import Head from './Head.js';

export default function Html (props) {
  return (
    <html lang='en-us'>
      <Head {...props} />
      <body>
        {props.content}
      </body>
    </html>
  );
};
