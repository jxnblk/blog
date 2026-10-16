import ColorMode from "./ColorModeButton.tsx";
import GridButton from "./GridButton.tsx";

export default function Nav () {
  return (
    <nav className="nav">
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
      <div className="nav-buttons">
        <ColorMode />
        <GridButton />
      </div>
    </nav>
  );
};
