import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import type { PostData } from "./types";

export default function Home (props: {
  posts: PostData[];
  css: string,
}) {
  return (
    <HTML css={props.css} path="">
      <Header home />
      <Footer />
    </HTML>
  );
};

