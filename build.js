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
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHTML from 'remark-html'

import Html from './src/Html.js'
import Post from './src/Post.js'

const config = {
  title: 'Jxnblk | Brent Jackson',
  description: 'Aspiring indie game developer, software engineer, and proud cat parent – he/him',
}

async function getPages () {
  const mds = readdirSync('src/posts').filter(f => extname(f) == '.md');
  const promises = mds.map(async filename => {
    const path = 'blog/' + basename(filename, '.md');
    const raw = readFileSync(join('src', 'posts', filename));
    const { content, data } = matter(raw);
    const vf = await remark()
      .use(remarkHTML)
      .process(content);
    const html = String(vf);

    return {
      filename,
      path,
      raw,
      html,
      ...data,
      content: Post({ ...data, html })
    };
  });
  // console.log(`Found ${mds.length} blog posts`);
  const pages = Promise.all(promises);
  return pages;
}

const pages = await getPages();
console.log(pages.length);

pages.forEach(page => {
  ensureDirSync(page.path);
  const filename = join(page.path, 'index.html');
  const write = createWriteStream(filename);
  const stream = renderToStaticNodeStream(x(Html, page));

  write.write('<!DOCTYPE html>\n');
  stream.pipe(write);

  write.on('finish', () => {
    console.log(page.path);
  });
});
