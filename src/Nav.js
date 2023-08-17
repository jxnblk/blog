import * as React from 'react';

export default function Nav () {
  return (
    <nav className='flex flex-wrap caps h5'>
      <div className='mr2' aria-hidden>
        //
      </div>
      <a href='/blog' className='nav'>
        Blog
      </a>
      <div className='mr2' />
      <a
        href='https://twitter.com/jxnblk'
        target='_blank'
        className='nav'>
        <span aria-hidden>x(</span>Twitter<span aria-hidden>)</span>
      </a>
      <div className='mr2' />
      <a
        href='https://github.com/jxnblk'
        target='_blank'
        className='nav'>
        GitHub<span aria-hidden>{'.{}'}</span>
      </a>
      <div className='mr2' />
      <a
        href='https://threads.net/@jxnblk'
        target='_blank'
        className='nav'>
        Threads<span aria-hidden>[]</span>
      </a>
    </nav>
  );
};
