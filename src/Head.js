import * as React from 'react';

export default function Head (props) {
  return (
    <head>
      <title>{props.title}</title>
      <meta name='description' content={props.description} />
      <link rel='stylesheet' href='/style.css' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin />
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css2?family=Lexend:wght@500;700&display=swap'
        crossOrigin
      />
    </head>
  );
};
