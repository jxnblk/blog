import * as React from 'react';
import { BlogPostCard } from './Blog.js';

export default function Devlog (props) {
  const posts = props.posts?.filter(p => p.tags?.includes('devlog'))
    .filter(p => !p.draft);

  return (
    <section id='devlog' className='container mb4'>
      <div className='flex mb2'>
        <div className='flex-grow flex p2 mr2 rev angr angr-up'>
          <h2 className='h4 caps'>
            <span aria-hidden>>$ </span>
            Devlog
          </h2>
        </div>
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
              transform: 'rotate(180deg)',
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
              transform: 'rotate(-90deg)',
            }}
            loading='lazy'
          />
        </div>
      </div>
      <hr className='bar mb2' />
      <ul className='list'>
        {posts.map(post => (
          <li
            key={post.path}
            className='mb3'>
            <BlogPostCard {...post} />
          </li>
        ))}
      </ul>
      <div className='p1 bg-stripe' />
    </section>
  );
};
