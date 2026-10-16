import { BlogPostCard } from './Blog.js';
import type { PostData } from "./types";

export default function Devlog (props: {
  posts: PostData[];
}) {
  const posts = props.posts?.filter(p => p.data.tags?.includes('devlog'))
    .filter(p => !p.data.draft);

  return (
    <section id='devlog'>
      <div>
        <div>
          <h2>
            <span aria-hidden>{">$"} </span>
            Devlog
          </h2>
        </div>
        <div aria-hidden>
          <img
            src='/images/arrow-box.svg'
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            style={{
              transform: 'rotate(180deg)',
            }}
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            style={{
              transform: 'rotate(-90deg)',
            }}
            loading='lazy'
          />
          <img
            src='/images/arrow-box.svg'
            style={{
              transform: 'rotate(-90deg)',
            }}
            loading='lazy'
          />
        </div>
      </div>
      <hr />
      <ul>
        {posts.map(post => (
          <li
            key={post.path}>
            <BlogPostCard {...post} />
          </li>
        ))}
      </ul>
      <div />
    </section>
  );
};
