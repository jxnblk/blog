
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Root = require('./components/Root.jsx');
var Index = require('./components/Index.jsx');
var Post = require('./components/Post.jsx');

var Routes = (
  <Route handler={Root} path="/">
    <DefaultRoute handler={Index} />
    <Route name="post" path="/posts/:post" handler={Post} />
  </Route>
);

module.exports = Routes;

