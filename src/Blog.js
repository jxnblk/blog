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
        <hr className='bar mb3' />
        <ul className='list'>
          {posts?.map(post => (
            <li
              key={post.path}
              className='mb3'>
              <h2 className='caps h1'>
                <a href={'/' + post.path}>
                  {post.title}
                </a>
              </h2>
              <div className='flex flex-wrap'>
                <div className='h6 mr2'>
                  {post.date?.toLocaleDateString()}
                </div>
                {post.tags?.map(tag => (
                  <div
                    key={tag}
                    className='h6 lh1 caps mr1 rev pad'>
                    #{tag}
                  </div>
                ))}
              </div>
              {post.excerpt && (
                <p>
                  {post.excerpt}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};
