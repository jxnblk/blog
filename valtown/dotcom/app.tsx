// core react component for jxnblkio
/** @jsxImportSource https://esm.sh/react@18.3.1 */
// import { MdContrast } from "https://esm.sh/react-icons/md";
import React from "https://esm.sh/react@18.3.1";
import { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { Avatar } from "./avatar.tsx";
import { Diagz, Tiled } from "./greebles.tsx";
import { colors, css } from "./css.tsx";
import { Vantom } from "./vantom.http.tsx";

const OGIMAGE = "https://jxnblk--92670e2200e811f0a151569c3dd06744.web.val.run/";
const URL = "https://jxnblk.com";
const DESCRIPTION = "Design engineer and aspiring indie game dev based in Brooklyn, NY";

type PostData = {
  path: string;
  slug: string;
  title: string;
  date: Date | string;
  excerpt?: string;
  html: string;
  tags?: string[];
};

const cx = (...cn) => cn.filter(Boolean).join(" ");

export function App(props) {
  const cookies: AppCookies = parseCookies(props.cookie || null);
  const initColorIndex = cookies.color || 0;
  const [colorIndex, setColorIndex] = useState<number>(initColorIndex);
  // TODO: add to vanilla
  const [baseline, setBaseline] = useState<boolean>(false);
  const cycleColor = () => {
    const next = (colorIndex + 1) % colors.length;
    setColorIndex(next);
    setCookie("color", next);
  };
  const color = useMemo(() => colors[colorIndex], [colorIndex]);

  const RouteComponent = props.data?.route ? routes[props.data.route] : routes[Route.Home];
  const reverse = colorIndex > 4;

  return (
    <html lang="en-us">
      <Head {...props} />
      <body className={cx(color, baseline && "baseline")}>
        {props.data?.vanilla && noflash}
        <div id="dotgrid" className={cx(baseline && "dotgrid")}>
          <Header cycleColor={cycleColor} />
          {RouteComponent && <RouteComponent {...props} reverse={reverse} />}
          <Footer
            reverse={reverse}
            toggleBaseline={() => setBaseline(b => !b)}
          />
          {props.data?.vanilla && vanilla}
        </div>
      </body>
    </html>
  );
}
// TODO: 404

function Head(props) {
  const { post } = props.data;
  let params = "";
  let description = DESCRIPTION;
  let title = "Jxnblk | Brent Jackson";
  let image = OGIMAGE;
  if (post) {
    params = `?text=${post.title}`;
    title = post.title + " | Jxnblk";
    image = post.image || (OGIMAGE + params);
  }

  return (
    <head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <link rel="icon" href="https://jxnblk-avatar.web.val.run?size=32&color=white&reverse=true&scale=1.375" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta property="og:image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={URL + props.pathname} />
      <meta property="og:type" content="website" />
      <meta property="og:logo" content="https://jxnblk-avatar.web.val.run" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@jxnblk" />

      <link rel="preconnect" href="https://esm.town" />
      <link rel="preconnect" href="https://esm.sh" />
      <link rel="preconnect" href="https://jxnblk.com" />
      <link rel="preconnect" href="https://novanticagame.com" />
    </head>
  );
}

const Link = ({ to, ...props }) => <a href={to} {...props} />;
const A = (props) => <a {...props} target="_blank" rel="noopener noreferrer" />;
const S = () => <>{" "}</>;

function Nav() {
  return (
    <>
      <Link to="/" className="navLink">Jxnblk</Link>
      <Link to="/blog" className="navLink">Blog</Link>
      <Link to="/#about" className="navLink">About</Link>
      <div className="md-hide fullwidth" />
      <A href="https://github.com/jxnblk" className="navLink">
        GitHub
      </A>
      <A href="https://x.com/jxnblk" className="navLink">
        Twitter (x)
      </A>
      <A href="https://val.town/u/jxnblk" className="navLink">
        Val Town
      </A>
    </>
  );
}

function Header({ cycleColor }: {
  cycleColor: () => void;
}) {
  return (
    <div className="container">
      <div className="flex gap2">
        <div className="angr grow" />
        <div className="angl h6 bold">
          v512.16.32
        </div>
      </div>
      <header className="nav">
        <Nav />
        <div className="ma" />
        <button
          id="color-button"
          onClick={cycleColor}
          title="Change color scheme"
          className="button"
        >
          {/* <MdContrast size={24} /> */}
          ⬤
        </button>
      </header>
    </div>
  );
}

function Footer(props) {
  return (
    <footer className="container mb2 mt2">
      <div className="flex gap2">
        <div className="angr angr-up" />
        <div className="angl angl-up grow" />
      </div>
      <div className="nav">
        <Avatar size={48} reverse={props.reverse} />
        <Nav />
      </div>
      <div className="mt2 greeble">
        <Tiled height={32}>
          <Diagz />
        </Tiled>
      </div>
      <div className="h6 flex">
        <Vantom size={24} />
        <button id="grid-button" onClick={props.toggleBaseline}>
          Grid
        </button>
        <div className="ma" />
        <div>
          ©2024 Brent Jackson. All rights reserved
        </div>
      </div>
    </footer>
  );
}

function Home(props) {
  return (
    <div className="container space-children">
      <div className="flex gap0 hero-container">
        <div
          className="noshrink"
          style={{
            marginLeft: -32,
          }}
        >
          <Avatar
            size={96}
            reverse={props.reverse}
          />
        </div>
        <div className="ma" />
        <div className="display h0 caps">
          Jxnblk
        </div>
      </div>
      <h1 className="normal mb">
        <b>Brent Jackson</b> is a design engineer at <A href="https://val.town">Val Town</A>,
        <S />
        aspiring <A href="https://novanticagame.com">indie game</A> developer, and proud cat parent.
        <S />
        Based in Brooklyn, NY
      </h1>
      <NovanticaPromoHero />
      <RecentPosts {...props} />
      <div className="greeble">
        <Tiled height={64} size={64} offset={32}>
          <Diagz size={64} />
        </Tiled>
      </div>
      <section id="about">
        <div className="flex mb">
          <h2 className="angr angr-up">About</h2>
        </div>
        <div
          className="bold-links"
          dangerouslySetInnerHTML={{ __html: props.data?.about?.html }}
        />
      </section>
    </div>
  );
}

function Unknown(props) {
  return (
    <div className="container">
      <h1>404 Not found</h1>
    </div>
  );
}

function NovanticaPromoHero() {
  return (
    <section className="promo">
      <div className="promo-inner">
        <img
          src="https://novanticagame.com/images/hero-xx.webp"
          alt="Novantica game hero shot"
          width="864"
          height="445"
        />
      </div>
      <A href="https://novanticagame.com" className="anchor">novanticagame.com</A>
    </section>
  );
}

function NovanticaPromoFooter() {
  return (
    <section className="promo mt2 mb2">
      <div className="promo-inner promo-short">
        <img
          src="https://novanticagame.com/images/hero-xx.webp"
          alt="Novantica game hero shot"
          width="864"
          height="445"
        />
      </div>
      <div className="flex invert pad">
        <div className="h6">I'm working on Novantica, a sci-fi adventure game</div>
        <div className="ma" />
        <div>
          <A href="https://store.steampowered.com/app/2437530/Novantica/">Wishlist on Steam</A>
        </div>
      </div>
    </section>
  );
}

const timestamp = (date: Date | string) => new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });

function PostHeader({ post, primary }: { post: PostData; primary?: boolean }) {
  const Element = primary ? "h1" : "h3";
  return (
    <div className="mb xmt2">
      <Element className="mb">
        <Link to={`/blog/${post.slug}`} className="post-title">
          {post.title}
        </Link>
      </Element>
      <div className="flex wrap h6">
        <div className="angr angr-up">{timestamp(post.date)}</div>
        <div className="mr" />
        {post.tags?.map(tag => <div key={tag}>#{tag}</div>)}
      </div>
    </div>
  );
}

function PostList({ posts }) {
  return (
    <>
      {posts && posts?.map(post => (
        <li key={post.path} data-slug={post.slug}>
          <PostHeader post={post} />
          <div
            dangerouslySetInnerHTML={{
              __html: post.excerpt,
            }}
          />
          <div className="flex">
            <div className="ma" />
            <Link to={`/blog/${post.slug}`}>
              Read the full post
            </Link>
          </div>
        </li>
      ))}
    </>
  );
}

function RecentPosts({ data }) {
  const recent = (data?.posts || [])
    .filter(p => !p.draft)
    .slice(0, 4);
  return (
    <section id="recent-posts">
      <h2>Recent Posts</h2>
      <ul className="posts">
        <PostList posts={recent} />
        <li>
          <Link to="/blog" className="">See all posts</Link>
        </li>
      </ul>
    </section>
  );
}

function Blog({ data }) {
  const posts = data.posts.filter(p => !p.draft);
  return (
    <div className="container">
      <h1>Blog</h1>
      <div className="greeble mt">
        <Tiled height={64} size={64} offset={32}>
          <Diagz size={64} />
        </Tiled>
      </div>
      <ul className="posts">
        <PostList posts={posts} />
      </ul>
    </div>
  );
}

function Post({ data }) {
  const { post } = data;
  return (
    <div className="container">
      <PostHeader post={post} primary />
      <div
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <NovanticaPromoFooter />
    </div>
  );
}

export enum Route {
  Home = "home",
  Blog = "blog",
  Post = "post",
  Unknown = "unknown",
}
interface Params {
  slug?: string;
}

type AppCookies = {
  color?: number;
};

export const routes: Record<Route, React.FunctionComponent> = {
  [Route.Home]: Home,
  [Route.Blog]: Blog,
  [Route.Post]: Post,
  [Route.Unknown]: Unknown,
};

export function setCookie(key: string, value: string) {
  fetch("/", {
    method: "POST",
    body: JSON.stringify({ cookie: { key, value } }),
  });
}

function parseCookies(cookies: string) {
  return (cookies || "").split(";").reduce((acc, n) => {
    const [key, value] = n.split("=").map(s => s.trim());
    const num = parseFloat(value);
    acc[key] = isNaN(num) ? value : num;
    return acc;
  }, {});
}

const vanilla = <script type="module" src="https://esm.town/v/jxnblk/dotcom/client.ts" />;

const noflash = (
  <script
    dangerouslySetInnerHTML={{
      __html: `
let color = localStorage.getItem("color");
if (color)  document.body.className = color;
`,
    }}
  />
);