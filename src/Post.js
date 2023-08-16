import * as React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

export default function Post (props) {
  return (
    <>
      <Header />
      <div className='container'>
        <h1>{props.title}</h1>
        <div>{props.date?.toLocaleDateString()}</div>
        <main
          dangerouslySetInnerHTML={{
            __html: props.html,
          }}
        />
      </div>
      <Footer />
    </>
  );
};
