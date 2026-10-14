import Nav from './Nav';
import ColorModeButton from './ColorModeButton.js';

export default function Header () {
  return (
    <header>
      <div>
        <div></div>
        <div>
          v512.16.0
        </div>
        <ColorModeButton />
      </div>
      <div>
        <a href='/'>
          Jxnblk
        </a>
      </div>
      <Nav />
    </header>
  );
};
