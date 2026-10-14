import Nav from './Nav';
import ColorModeButton from './ColorModeButton.js';

export default function Header () {
  return (
    <header>
      <a href='/'>
        Jxnblk
      </a>
      <ColorModeButton />
      <Nav />
    </header>
  );
};
