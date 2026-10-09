import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import { pad } from './Blog';

import type { PostData } from "./types";

export default function Post (props: PostData & {}) {
  if (!props.data.date) {
    console.error("NO DATE FOR POST " + JSON.stringify(props.data, null, 2));
    return null;
  }

  return (
    <HTML {...props}>
      <Header />
      <div className='container mb4'>
        {props.data.draft && (
          <div className='p1 caps rev angr mr4'>
            Draft
          </div>
        )}
        <div className='inline-flex p1 mb1 h6 caps rev angr angr-up angr-sm'>
          {props.data.devlog ? (
            <>
              Devlog {pad(props.data.devlog)}
            </>
          ) : (
            <>
              Blog <span aria-hidden>//</span>
            </>
          )}
        </div>
        <h1 className='h2 caps mb3'>
          {props.data.title}
        </h1>
        <div className='flex flex-wrap mb2'>
          <div className='caps h6 mr1'>
            {props.data.date.toLocaleDateString('en-US', { timeZone: 'UTC' })}
          </div>
          {props.data.tags?.map(tag => (
            <div
              key={tag}
              className='caps h6 lh1 rev pad mr1'>
              #{tag}
            </div>
          ))}
        </div>
        <main className="prose mb3">
          {props.tree}
        </main>
        {/* <Promo /> */}
      </div>
      <Footer />
    </HTML>
  );
};

/*
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
        <p className='my1'>
          I'm currently working on Novantica, a sci-fi adventure game.
        </p>
        <div className='ma sm-hide' />
        <a
          href='https://store.steampowered.com/app/2437530/Novantica/'
          className='btn btn-black'>
          Wishlist on Steam
        </a>
      </div>
    </div>
  );
};
*/
