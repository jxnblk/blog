
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var fm = require('front-matter');
var marked = require('marked');
var markedRenderer = require('./marked-renderer');
var cssnext = require('cssnext');
var cheerio = require('cheerio');
var pkg = require('./package.json');

var dir = './src/posts';
var filenames = fs.readdirSync(dir).filter(function(filename){
  return !/^\./.test(filename);
});
var posts = filenames.map(function(filename) {
  var content = fs.readFileSync(path.join(dir, filename), 'utf8');
  var matter = fm(content);
  var html = marked(matter.body, { renderer: markedRenderer });
  var $ = cheerio.load(html);
  var excerpt = $('p').first().text();
  var post = _.assign(matter.attributes, {
    slug: filename.replace(/\.md/, ''),
    body: matter.body, 
    html: html,
    excerpt: excerpt
  });
  return post;
}).sort(function(a, b) {
  return new Date(b.created) - new Date(a.created); 
});

var routes = filenames.map(function(filename) {
  return '/posts/' + filename.replace(/\.md$/,'');
});
routes.unshift('/');
console.log(routes);

module.exports = {
  title: 'jxnblk.com/writing',
  description: pkg.description,
  author: pkg.author,
  css: cssnext([
    '@import "basscss-base-reset";',
    '@import "basscss-base-typography";',
    '@import "basscss-color-base";',
    '@import "basscss-utility-typography";',
    '@import "basscss-utility-layout";',
    '@import "basscss-white-space";',
    '@import "basscss-highlight";',
    '@import "site";',
    '@import "basscss-defaults";',
  ].join('\n'), {
    compress: true,
    features: {
      rem: false,
      pseudoElements: false,
      colorRgba: false,
      customProperties: {
        variables: {
          //'h1': '2.5rem',
          //'h2': '1.75rem',
          //'h3': '1.5rem',
          'h4': '1.125rem',
          //'h5': '1rem',
          'line-height': '1.625',
          'heading-font-weight': '500',
          'button-font-weight': '500',
          'bold-font-weight': '500',
          'space-1': '.75rem',
          'space-2': '1.5rem',
          'space-3': '3rem',
          'space-4': '6rem',
          'link-color': 'inherit',
          'link-text-decoration': 'underline',
          'button-font-size': 'var(--h5)',
          'container-width': '48em',
          //'pre-background-color': 'var(--darken-1)',
        }
      }
    }
  }),
  posts: posts,
  routes: routes,
  //baseUrl: '/',
  baseUrl: '/writing/',
};

