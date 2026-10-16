export default function Head (props: {
  image?: string;
  title?: string;
  description?: string;
  path: string;
  css: string;
}) {
  const image = props.image || 'https://jxnblk.com/images/avatar.png';
  const title = props.title || 'Jxnblk | Brent Jackson';
  const desc = props.description || 'Aspiring indie game developer, software engineer, and proud cat parent';

  return (
    <head>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta name='viewport' content='width=device-width' />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="alternate" type="application/rss+xml" title="Jxnblk Blog" href="/rss.xml" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HFKR2KM1HK"></script>
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
      <style dangerouslySetInnerHTML={{ __html: props.css }} />
    </head>
  );
};
