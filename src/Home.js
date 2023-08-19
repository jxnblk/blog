import * as React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import Devlog from './Devlog.js';

export default function Home (props) {
  return (
    <>
      <Header home />
      <Novantica />
      <Devlog {...props} />
      <Autoforma />
      <PastProjects />
      <Laser />
      <Footer />
    </>
  );
};

function Novantica () {
  return (
    <section id='novantica' className='container mb4'>
      <div className='rel mb2'>
        <img
          src='https://novanticagame.com/images/hero.jpg'
          alt='Novantica game screenshot with protagonist on hoverboard'
        />
        <div className='abs-se mr2 mb2'>
          <a
            href='https://novanticagame.com'
            className='btn'>
            Novanticagame.com <span aria-hidden>{'>>'}</span>
          </a>
        </div>
      </div>
      <h2 className='h4 caps'>
        <span aria-hidden>//</span> Current Work
      </h2>
      <div className='flex flex-break'>
        <div className='my2'>
          <p className='mb1'>
            I'm currently working on Novantica, a sci-fi adventure game – coming soon to Steam
          </p>
          <a
            href='https://store.steampowered.com/app/2437530/Novantica/'
            className='btn'>
            Wishlist on Steam
          </a>
        </div>
        <div className='flex flex-none oh'>
          <img
            aria-hidden
            src='/images/double-helix.svg'
            className='ml2 sm-hide'
          />
          <img
            aria-hidden
            src='/images/magplate.svg'
            className='ml2'
          />
          <img
            aria-hidden
            src='/images/hexagon.svg'
            className='ml2'
          />
        </div>
      </div>
    </section>
  );
};

function Autoforma () {
  return (
    <div aria-hidden className='container mb4'>
      <div className='flex lh1'>
        <div className='ma' />
        <div className='h6 caps'>
          Mag
        </div>
      </div>
      <hr className='line' />
      <div className='flex lh1'>
        <div className='ma' />
        <div className='h6 caps'>
          x64
        </div>
      </div>
      <div className='flex oh'>
        <img
          src='/images/autoforma.svg'
          loading='lazy'
        />
        <img
          src='/images/double-helix.svg'
          className='ml2 sm-hide'
          loading='lazy'
        />
        <div className='ma' />
        <img
          src='/images/conveyor.svg'
          className='ml1'
          loading='lazy'
        />
      </div>
    </div>
  );
};

function PastProjects () {
  return (
    <section id='past-projects' className='container mb4'>
      <div className='flex'>
        <div className='flex-grow flex p2 rev angr angr-up'>
          <h2 className='h4 caps'>// Past Projects</h2>
        </div>
        <div
          className='p2 bg-stripe'
          style={{
            width: 256,
          }}
        />
        <div aria-hidden className='flex sm-hide'>
          <img
            src='/images/arrow-box.svg'
            className='ml2'
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            className='ml1'
            style={{
              transform: 'rotate(90deg)',
            }}
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            className='ml1'
            style={{
              transform: 'rotate(-90deg)',
            }}
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            className='ml1'
            style={{
              transform: 'rotate(180deg)',
            }}
            loading='lazy'
          />
        </div>
      </div>
      <div className='columns mt2 mb2 rel'>
        {projects.map(p => (
          <a
            key={p.name}
            href={p.href}
            className='caps'
          >
            {p.name}
          </a>
        ))}
        <img
          src='/images/bubo.svg'
          className='abs-se'
          width='64'
          height='64'
          aria-hidden
          loading='lazy'
        />
      </div>
      <div className='p1 bg-stripe' />
    </section>
  );
};

const projects = [
  { name: 'Theme UI', href: 'https://github.com/system-ui/theme-ui' },
  { name: 'Styled System', href: 'https://github.com/styled-system/styled-system' },
  { name: 'Rebass', href: 'https://github.com/rebassjs/rebass' },
  { name: 'MDX Deck', href: 'https://github.com/jxnblk/mdx-deck' },
  { name: 'Basscss', href: 'https://basscss.com' },
  { name: 'Colorable', href: 'https://colorable.jxnblk.com/' },
  { name: 'Hello Color', href: 'https://jxnblk.github.io/hello-color/' },
  { name: 'Contrast Swatch', href: 'https://github.com/jxnblk/contrast-swatch' },
  { name: 'Palx', href: 'https://palx.jxnblk.com/' },
  { name: 'CSS Stats', href: 'https://cssstats.com/' },
  { name: 'Microicon', href: 'https://github.com/jxnblk/microicon' },
  { name: 'Repng', href: 'https://github.com/jxnblk/repng' },
  { name: 'Reline', href: 'https://jxnblk.github.io/reline/' },
  { name: 'Paths', href: 'https://jxnblk.github.io/paths/' },
  { name: 'Loading', href: 'https://jxnblk.github.io/loading/' },
  { name: 'Spectral', href: 'https://jxnblk.github.io/Spectral/' },
  { name: 'Microbeats', href: 'https://microbeats.cc/' },
  { name: 'MrsJxn', href: 'http://mrsjxn.com/' },
  { name: 'Skullcat', href: 'https://jxnblk.github.io/skullcat' },
]

function Laser () {
  return (
    <div aria-hidden className='container mb3'>
      <div className='border'>
        <img src='/images/laser.svg' loading='lazy' />
      </div>
    </div>
  );
};
