import HomeLink from './HomeLink';
import Nav from './Nav';

export default function Header () {
  return (
    <header className="main grid site-header">
      <HomeLink />
      <Nav />
    </header>
  );
};
