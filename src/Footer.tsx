import Nav from './Nav';

const YEAR = new Date().getFullYear();

export default function Footer () {
  return (
    <footer>
      <div
        style={{
          height: 256,
          clipPath: 'polygon(evenodd, 0 0, 100% 0, 100% 128px, 30% 128px, 30% 256px, 0 256px)',
          marginBottom: -96,
        }}
      />
      <div>
        <img
          src='/images/avatar.svg'
          width="96"
          height="96"
          alt='avatar'
          loading='lazy'
        />
        <img
          src='/images/avatar-dark.svg'
          // width="96" height="96"
          alt='avatar'
          loading='lazy'
        />
      </div>
      <Nav />
      <div>
        <img
          aria-hidden
          src='/images/vantom.svg'
          width='32'
          height='32'
          loading='lazy'
        />
        <div>
          © {YEAR} Brent Jackson. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
