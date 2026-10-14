import ColorMode from "./ColorModeButton.tsx";

export default function Nav () {
  return (
    <nav>
      <a href='/blog'>
        Blog
      </a>
      <a
        href='https://github.com/jxnblk'
        target='_blank'>
        GitHub
      </a>
      <a
        href='https://twitter.com/jxnblk'
        target='_blank'>
        Twitter
      </a>
      <ColorMode />
    </nav>
  );
};
