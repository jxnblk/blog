import HomeLink from './HomeLink';
import Nav from './Nav';

const YEAR = new Date().getFullYear();

export default function Footer () {
  return (
    <footer className="main grid site-footer">
      <HomeLink />
      <Nav />
      <div className="copyright">
        © {YEAR} Brent Jackson. All rights reserved.
      </div>
    </footer>
  );
};
