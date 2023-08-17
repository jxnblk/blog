import * as React from 'react';
import Nav from './Nav.js';

export default function Footer () {
  return (
    <footer className='container mb3'>
      <div
        className='bg-warning'
        style={{
          height: 256,
          clipPath: 'polygon(evenodd, 0 0, 100% 0, 100% 128px, 30% 128px, 30% 256px, 0 256px)',
          marginBottom: -96,
        }}
      />
      <div className='flex caps oh'>
        <div className='ma' />
        <img src='/images/avatar-dark.svg' alt='avatar' loading='lazy' />
        <div className='p2'>
          Jxnblk<br />
          MMXXIII
        </div>
        <div className='p2 sm-hide'>
          256.1024
        </div>
        <div className='p2 flex-none'>
          <img aria-hidden src='/images/bot-term.svg' loading='lazy' />
        </div>
      </div>
      <hr className='bar mb2' />
      <Nav />
      <div className='h5 mt3 flex'>
        <img
          aria-hidden
          src='/images/vantom.svg'
          width='32'
          height='32'
          loading='lazy'
        />
        <div className='ma' />
        <div>
          © 2023 Brent Jackson. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
