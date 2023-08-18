import * as React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

export default function Post (props) {
  return (
    <>
      <Header />
      <div className='container mb4'>
        {props.draft && (
          <div className='p1 caps rev angr mr4'>
            Draft
          </div>
        )}
        <h1 className='caps mb3'>
          {props.title}
        </h1>
        <div className='flex flex-wrap mb2'>
          <div className='caps h6 mr1'>
            {props.date?.toLocaleDateString()}
          </div>
          {props.tags?.map(tag => (
            <div
              key={tag}
              className='caps h6 lh1 rev pad mr1'>
              #{tag}
            </div>
          ))}
        </div>
        <main
          className='prose mb3'
          dangerouslySetInnerHTML={{
            __html: props.html,
          }}
        />
        <Promo />
      </div>
      <Footer />
    </>
  );
};

function Promo () {
  return (
    <div className=''>
      <a
        href='https://store.steampowered.com/app/2437530/Novantica/'
        className=''>
        <img
          src='/images/novantica-promo.jpg'
          alt='Novantica game screenshot with protagonist on hoverboard'
        />
      </a>
      <div className='p2 rev flex flex-wrap'>
        <p className=''>
          I'm currently working on Novantica, a sci-fi adventure game.
        </p>
        <div className='ma' />
        <a
          href='https://store.steampowered.com/app/2437530/Novantica/'
          className='btn btn-black'>
          Wishlist on Steam
        </a>
      </div>
    </div>
  );
};
