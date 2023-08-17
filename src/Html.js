import * as React from 'react';
import Head from './Head.js';

export default function Html (props) {
  return (
    <html lang='en-us'>
      <Head {...props} />
      <body className=''>
        {props.content}
        <script
          dangerouslySetInnerHTML={{
            __html: script,
          }}
        />
      </body>
    </html>
  );
};

const script = `
const modes = [
  '',
  'orange',
  'gray',
  'pink',
  'lite',
];

let index = 0;

function cycle () {
  index = (index + 1) % modes.length;
  const next = modes[index];
  document.body.className = next;
};

const el = document.querySelector('#color-button');
if (el != null) el.addEventListener('click', cycle);
`
