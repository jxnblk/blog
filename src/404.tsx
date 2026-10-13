import HTML from "./HTML";
import Header from './Header.js';
import Footer from './Footer.js';

export default function (props: {
  css: string;
}) {
  return (
    <HTML path="" css={props.css}>
      <Header />
      <div>
        <div>
          ERR 404
        </div>
      </div>
      <Footer />
    </HTML>
  );
};
