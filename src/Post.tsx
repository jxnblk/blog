import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';

import type { PostData } from "./types";

export default function Post (props: PostData & {
  css: string;
}) {
  if (!props.data.date) {
    // TODO: support drafts?
    // console.error("NO DATE FOR POST " + JSON.stringify({ data: props.data }, null, 2));
    return null;
  }

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
