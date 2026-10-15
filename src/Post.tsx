import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import Flourish from './Flourish';
import { rng } from './rng';

import type { PostData } from "./types";

export default function Post (props: PostData & {
  css: string;
}) {
  if (!props.data.date) {
    console.error("NO DATE FOR POST " + JSON.stringify(props.data, null, 2));
    return null;
  }

  // a 4×4 flourish in the header's negative space, beside the title
  const seed = props.data.seed ?? props.slug;
  const start = rng(seed)("header").pick([9, 13]);

  return (
    <HTML path={props.path} data={props.data} css={props.css}>
      <Header />
      <main className="main grid">
        <header className="post-header">
          <h1 className="post-title">
            {props.data.title}
          </h1>
          <div className="post-meta">
            {props.data.draft && <span>Draft</span>}
            <span>
              {props.data.date.toLocaleDateString('en-US', { timeZone: 'UTC' })}
            </span>
            {props.data.tags?.map(tag => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>
          <div className="post-flourish" style={{ "--start": start } as React.CSSProperties}>
            <Flourish seed={`${seed}:header`} size={4} />
          </div>
        </header>
        <div className="spacer spacer-section" />
        {/* blocks, spacers, and margins come from rehypeSections */}
        <div className="post-body">
          {props.tree}
        </div>
      </main>
      <Footer />
    </HTML>
  );
};
