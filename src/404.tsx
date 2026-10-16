import HTML from "./HTML";
import Header from './Header';
import Footer from './Footer';
import { TitleBands, titleStyle } from "./Home";

const TITLE = "404: Page not found";
const SEED = "404:title";

export default function (props: {
  css: string;
}) {
  return (
    <HTML path="" css={props.css}>
      <Header />
      <main className="main grid">
        <TitleBands seed={SEED} position="above" />
        <header className="post-header home-header">
          <h1 className="home-title" style={titleStyle(TITLE)}>
            {TITLE}
          </h1>
        </header>
        <TitleBands seed={SEED} position="below" />
      </main>
      <Footer />
    </HTML>
  );
};
