import Nav from './Nav';

export default function Header () {
  return (
    <header>
        <img
          src='/images/avatar.svg'
          width="96"
          height="96"
          alt='avatar'
          loading='lazy'
        />
      <a href='/' className="">
        Jxnblk
      </a>
      <Nav />
    </header>
  );
};
