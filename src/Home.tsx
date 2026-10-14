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
      <div>
          <div>
            <h1>
              <span>
                Brent Jackson
              </span>
              <span>
                {" "}
                is a design engineer, aspiring indie game developer, and proud cat parent.
                Based in Brooklyn, NY
              </span>
            </h1>
            <div />
            <div>
              <div>
                <img
                  src='/images/avatar.svg'
                  alt='Avatar'
                  width='128'
                  height='128'
                />
              </div>
            </div>
          </div>

      </div>
      <div className="prose">
        {props.about}
      </div>
      <Footer />
    </HTML>
  );
};

