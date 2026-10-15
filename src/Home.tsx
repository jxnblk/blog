import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import type { PostData } from "./types";

export default function Home (props: {
  posts: PostData[];
  css: string;
  about: React.ReactElement;
}) {
  return (
    <HTML css={props.css} path="">
      <Header />
      <main className="main grid">
        <header className="post-header home-header">
          <div className="home-avatar">
            <img
              src='/images/avatar.svg'
              alt='Avatar'
              width='128'
              height='128'
            />
          </div>
          <h1 className="home-title">
            Brent Jackson
            {" "}
            is a design engineer, aspiring indie game developer, and proud cat parent.
            Based in Brooklyn, NY
          </h1>
        </header>
        <div className="spacer spacer-section" />
        {/* blocks, spacers, and margins come from rehypeSections */}
        <div className="post-body">
          {props.about}
        </div>
      </main>
      <Footer />
    </HTML>
  );
};

