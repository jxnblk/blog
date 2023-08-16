import * as React from 'react';

export default function Footer () {
  return (
    <footer class='container mt4 mb2'>
      <div
        className='bg-warning'
        style={{
          minHeight: 160,
        }}
      />
      <div className='flex caps'>
        <div className='ma' />
        <img src='/images/avatar-dark.svg' alt='avatar' />
        <div className='p4'>
          Jxnblk<br />
          MMXXIII
        </div>
        <div className='p4'>
          256.1024
        </div>
        <div className='p4'>
          <img src='/images/bot-term.svg' />
        </div>
      </div>
      <div className='h5'>
        © 2023 Brent Jackson. All rights reserved.
      </div>
    </footer>
  );
};
