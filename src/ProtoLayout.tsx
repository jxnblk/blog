
import HTML from "./HTML";
import Header from "./Header";
import Footer from "./Footer";

const SIXTEEN = Array.from({ length: 16 });

export default function ProtoLayout (props: {
  css: string;
}) {
  return (
    <HTML path="layout" {...props}>
      <Header />
      <div className="main debug">
        <div className="grid">
          <div>
            TK proto layout
          </div>
          <div className="" />
          {SIXTEEN.slice(0, -2).map((_, i) => (
            <div key={i} className="" />
          ))}
          <div className="span-7">7</div>
          <div className="span-9">9</div>
          {SIXTEEN.map((_, i) => (
            <div key={i} className="">{i}</div>
          ))}
          <div className="span-5">5</div>
          <div className="span-11">11</div>
        </div>
      </div>
      <Footer />
    </HTML>
  );
}
