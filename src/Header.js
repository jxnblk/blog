import * as React from 'react';
import Nav from './Nav.js';

export default function Header (props) {
  return (
    <header className='container mb3'>
      <div className='flex mt2'>
        <div className='flex rev angr angr-sm mr2 flex-grow'></div>
        <div className='h5 p1 caps flex rev ml2 angl angl-sm'>
          v512.16.0
        </div>
      </div>
      <div className='h0 t3 caps'>
        <a href='/'>
          Jxnblk
        </a>
      </div>
      <hr className='line' />
      <div className='flex flex-break mb2'>
        <h1 className='lh1'>
          <span className='h3 caps'>
            Brent Jackson
          </span>
          <br />
          <span className='h4 medium'>
            Aspiring indie game developer, software engineer, and proud cat parent
            <br />
            Based in Brooklyn, NY
          </span>
        </h1>
        <div className='ma' />
        <div className='flex flex-none'>
          <div className='flex flex-none rev mx1 my1 caps h2'
            style={{
              width: 128,
              height: 128,
            }}>
            <div className='ma'>
              2023
            </div>
          </div>
          <div className='rev flex-none my1'>
            <img
              src='/images/avatar.svg'
              alt='Avatar'
              width='128'
              height='128'
              className=''
            />
          </div>
        </div>
      </div>
      <hr className='bar barl mb2' />
      <Nav />
    </header>
  );
};
