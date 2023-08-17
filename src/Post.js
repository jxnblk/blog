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
          className='prose'
          dangerouslySetInnerHTML={{
            __html: props.html,
          }}
        />
      </div>
      <Footer />
    </>
  );
};
