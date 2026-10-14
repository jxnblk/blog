import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';

import type { PostData } from "./types";

export default function Post (props: PostData & {
  css: string;
}) {
  if (!props.data.date) {
    console.error("NO DATE FOR POST " + JSON.stringify(props.data, null, 2));
    return null;
  }

  return (
    <HTML path={props.path} data={props.data} css={props.css}>
      <Header />
      <div>
        {props.data.draft && (
          <div>
            Draft
          </div>
        )}
        <h1>
          {props.data.title}
        </h1>
        <div>
          <div>
            {props.data.date.toLocaleDateString('en-US', { timeZone: 'UTC' })}
          </div>
          {props.data.tags?.map(tag => (
            <div
              key={tag}>
              #{tag}
            </div>
          ))}
        </div>
        <main className="prose">
          {props.tree}
        </main>
      </div>
      <Footer />
    </HTML>
  );
};
