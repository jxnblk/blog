import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";

import type { PostData } from "./types";

export default function Blog (props: {
  posts: PostData[];
  css: string;
}) {
  const posts = props.posts?.sort((a, b) => {
    if (a.data.date < b.data.date) return 1;
    else if (a.data.date > b.data.date) return -1;
    else return 0;
  }).filter(p => !p.data.draft);

  return (
    <HTML
      path="blog"
      css={props.css}
      data={{
        title: "Blog",
      }}
    >
      <Header />
      <div>
        <h1>
          Blog
        </h1>
        <div />
        <ul>
          {posts?.map(post => (
            <li
              key={post.path}>
              <BlogPostCard {...post} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </HTML>
  );
};

export function BlogPostCard (props: PostData) {
  return (
    <>
      <h2>
        <a href={'/' + props.path}>
          {props.data.title}
        </a>
      </h2>
      <div className="flex gap-1">
        <div>
          {props.data.date?.toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </div>
        {props.data.tags?.map(tag => (
          <div
            key={tag}>
            #{tag}
          </div>
        ))}
      </div>
      {props.excerpt && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: props.excerpt,
            }}
          />
          <a
            href={'/' + props.path}>
            Read more <span aria-hidden>{">>"}</span>
          </a>
        </>
      )}
    </>
  );
};

export const pad = (n: number) => ('00' + n).slice(-2);
