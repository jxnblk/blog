export default function Nav () {
  return (
    <nav>
      <div aria-hidden>
        //
      </div>
      <a href='/blog'>
        Blog
      </a>
      <div />
      <a
        href='https://twitter.com/jxnblk'
        target='_blank'>
        <span aria-hidden>x(</span>Twitter<span aria-hidden>)</span>
      </a>
      <div />
      <a
        href='https://github.com/jxnblk'
        target='_blank'>
        GitHub<span aria-hidden>{'.{}'}</span>
      </a>
      <div />
      <a
        href='https://threads.net/@jxnblk'
        target='_blank'>
        Threads<span aria-hidden>[]</span>
      </a>
    </nav>
  );
};
