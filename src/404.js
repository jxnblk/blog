import * as React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

export default function () {
  return (
    <>
      <Header />
      <div className='container mt4 mb4'>
        <div className='h0 caps bold'>
          ERR 404
        </div>
      </div>
      <Footer />
    </>
  );
};
