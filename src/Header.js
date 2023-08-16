import * as React from 'react';

export default function Header (props) {
  return (
    <header class='container'>
      <div class='flex mb2 mt2'>
        <div class='flex rev angr angr-sm mr2 flex-grow'></div>
        <div class='h5 p3 caps flex rev ml2 angl angl-sm'>
          v512.16.0
        </div>
      </div>
      <h1 class='caps h3 mb3'>
        <span class='h0 t2'>
          Jxnblk
        </span>
        <br />
        Brent Jackson
      </h1>
      <hr class='bar barl' />
      <nav>
        <a href='/blog' class='caps'>Blog</a>
      </nav>
    </header>
  );
};
