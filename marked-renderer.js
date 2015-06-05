
var marked = require('marked')
var highlight = require('highlight.js')

var renderer = new marked.Renderer()

renderer.code = function(code, lang) {

  var result = [
    '<pre>',
    highlight.highlightAuto(code, [lang]).value,
    '</pre>',
  ].join('')

  return result

}

module.exports = renderer

