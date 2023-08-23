import * as React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

export default function Blog (props) {
  const posts = props.posts?.sort((a, b) => {
    if (a.date < b.date) return 1;
    else if (a.date > b.date) return -1;
    else return 0;
  }).filter(p => !p.draft);

  return (
    <>
      <Header />
      <div className='container mb4'>
        <h1 className='caps h1 mb2'>
          Blog
        </h1>
        <div className='p1 bg-stripe mb3' />
        <ul className='list'>
          {posts?.map(post => (
            <li
              key={post.path}
              className='mb3'>
              <BlogPostCard {...post} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export function BlogPostCard (props) {
  return (
    <>
      <h2 className='caps h2'>
        <a href={'/' + props.path}>
          {props.devlog && (
            <div className='h6'>
              Devlog {pad(props.devlog)}
              <br />
            </div>
          )}
          {props.title}
        </a>
      </h2>
      <div className='flex flex-wrap'>
        <div className='h6 mr2'>
          {props.date?.toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </div>
        {props.tags?.map(tag => (
          <div
            key={tag}
            className='h6 lh1 caps mr1 rev pad'>
            #{tag}
          </div>
        ))}
      </div>
      {props.excerpt && (
        <>
          <div
            className='prose mt1'
            dangerouslySetInnerHTML={{
              __html: props.excerpt,
            }}
          />
          <a
            href={'/' + props.path}
            className='caps h6 pad rev'>
            Read more <span aria-hidden>>></span>
          </a>
        </>
      )}
    </>
  );
};

export const pad = n => ('00' + n).slice(-2);
