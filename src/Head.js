import * as React from 'react';

export default function Head (props) {
  const image = props.image || 'https://jxnblk.com/images/avatar.png';
  const title = props.title || 'Jxnblk | Brent Jackson';
  const desc = props.description || 'Aspiring indie game developer, software engineer, and proud cat parent';

  return (
    <head>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta name='viewport' content='width=device-width' />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel='stylesheet' href='/style.css' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css2?family=Lexend:wght@500;700&display=swap'
        crossOrigin='true'
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HFKR2KM1HK"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: ga,
        }}
      />
      {props.image ? (
        <meta name='twitter:card' content='summary_large_image' />
      ) : (
        <meta name='twitter:card' content='summary' />
      )}
      <meta name='twitter:site' content='@jxnblk' />
      <meta name='twitter:creator' content='@jxnblk' />
      <meta property='og:url' content={`https://jxnblk.com/${props.path}`} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={desc} />
      <meta property='og:image' content={image} />
      <meta name='twitter:image' content={image} />
    </head>
  );
};

const ga = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HFKR2KM1HK');`;

