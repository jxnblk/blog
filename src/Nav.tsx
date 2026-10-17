import ColorMode from "./ColorModeButton.tsx";
import GridButton from "./GridButton.tsx";

export default function Nav () {
  return (
    <nav className="nav">
      <a href='/blog' className='caps'>
        Blog
      </a>
      <a
        href='https://github.com/jxnblk'
        className='caps'
        target='_blank'>
        GitHub
      </a>
      <a
        href='https://twitter.com/jxnblk'
        className='caps'
        target='_blank'>
        Twitter
      </a>
      <ColorMode />
      <GridButton />
    </nav>
  );
};
