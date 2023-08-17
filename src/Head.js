import * as React from 'react';

export default function Head (props) {
  return (
    <head>
      <title>{props.title}</title>
      <meta name='description' content={props.description} />
      <meta name='viewport' content='width=device-width' />
      <link rel='stylesheet' href='/style.css' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css2?family=Lexend:wght@500;700&display=swap'
        crossOrigin
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HFKR2KM1HK"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: ga,
        }}
      />
    </head>
  );
};

const ga = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HFKR2KM1HK');`;
