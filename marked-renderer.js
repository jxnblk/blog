
var marked = require('marked')
var highlight = require('highlight.js')
var _kebab = require('lodash').kebabCase

var renderer = new marked.Renderer()

renderer.code = function (code, lang) {

  var result = [
    '<pre>',
    highlight.highlightAuto(code, [lang]).value,
    '</pre>'
  ].join('')

  return result

}

renderer.heading = function (text, level) {
  var name = _kebab(text);
  var result;
  if (level < 4) {
    result =
      '<h' + level + ' id="' + name + '">'+
      '<a href="#' + name + '">'+ text + '</a>'+
      '</h' + level + '>';
  } else {
    result = '<h' + level + '>' + text + '</h' + level + '>';
  }
  return result;
}

module.exports = renderer

