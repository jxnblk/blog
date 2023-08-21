import {
  basename,
  extname,
  join
} from 'node:path';
import {
  readdirSync,
  readFileSync,
  createWriteStream
} from 'node:fs';
import { ensureDirSync } from 'fs-extra';
import { createElement as x } from 'react';
import { renderToStaticNodeStream } from 'react-dom/server';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHTML from 'remark-html';
import remarkExcerpt from 'remark-excerpt';

import Html from './src/Html.js';
import Home from './src/Home.js';
import NotFound from './src/404.js';
import Blog from './src/Blog.js';
import Post from './src/Post.js';

const config = {
  title: 'Jxnblk | Brent Jackson',
  description: 'Aspiring indie game developer, software engineer, and proud cat parent – he/him',
};

async function getPages () {
  const mds = readdirSync('src/posts').filter(f => extname(f) == '.md');
  const promises = mds.map(async filename => {
    const path = 'blog/' + basename(filename, '.md');
    const raw = readFileSync(join('src', 'posts', filename));
    const { content, data } = matter(raw);
    const vf = await remark()
      .use(remarkHTML, { sanitize: false })
      .process(content);
    const html = String(vf);
    const evf = await remark()
      .use(remarkExcerpt)
      .use(remarkHTML, { sanitize: false })
      .process(content);
    const excerpt = String(evf);

    return {
      filename,
      path,
      raw,
      html,
      excerpt,
      description: data.description || data.excerpt || null,
      ...data,
      content: Post({ ...data, html })
    };
  });
  // console.log(`Found ${mds.length} blog posts`);
  const posts = await Promise.all(promises);

  const pages = [ ...posts ];

  pages.push({
    path: 'blog',
    content: Blog({ posts }),
  });

  pages.push({
    path: '',
    content: Home({ posts }),
  });
  pages.push({
    path: '404',
    content: NotFound(),
  })

  return pages;
};

const pages = await getPages();
console.log(pages.length);

pages.forEach(page => {
  if (page.path) ensureDirSync(page.path);
  let filename = join(page.path, 'index.html');
  if (page.path == '404') {
    filename = '404.html';
  };
  const write = createWriteStream(filename);
  const stream = renderToStaticNodeStream(x(Html, page));

  write.write('<!DOCTYPE html>\n');
  stream.pipe(write);

  write.on('finish', () => {
    console.log(page.path);
  });
});
