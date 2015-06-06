
var React = require('react')
var Router = require('react-router')
var Routes = require('./Routes.jsx')

module.exports = function render (locals, callback) {
  Router.run(Routes, locals.path, function (Handler, state) {
    locals.params = state.params
    var html = React.renderToStaticMarkup(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>' + html)
  })
}

