import Header from "./Header";
import Footer from "./Footer";

import type { PostData } from "./types";

export default function Blog (props: {
  posts: PostData[];
}) {
  const posts = props.posts?.sort((a, b) => {
    if (a.data.date < b.data.date) return 1;
    else if (a.data.date > b.data.date) return -1;
    else return 0;
  }).filter(p => !p.data.draft);

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

export function BlogPostCard (props: PostData) {
  return (
    <>
      <h2 className='caps h2'>
        <a href={'/' + props.path}>
          {props.data.devlog && (
            <div className='h6'>
              Devlog {pad(props.data.devlog)}
              <br />
            </div>
          )}
          {props.data.title}
        </a>
      </h2>
      <div className='flex flex-wrap'>
        <div className='h6 mr2'>
          {props.data.date?.toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </div>
        {props.data.tags?.map(tag => (
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
            Read more <span aria-hidden>{">>"}</span>
          </a>
        </>
      )}
    </>
  );
};

export const pad = (n: number) => ('00' + n).slice(-2);
