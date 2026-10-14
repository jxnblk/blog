import Nav from './Nav';

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
        <div />
        <img src='/images/avatar-dark.svg' alt='avatar' loading='lazy' />
        <div>
          Jxnblk<br />
          MMXXVI
        </div>
      </div>
      <hr />
      <Nav />
      <div>
        <img
          aria-hidden
          src='/images/vantom.svg'
          width='32'
          height='32'
          loading='lazy'
        />
        <div />
        <div>
          © 2023 Brent Jackson. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
