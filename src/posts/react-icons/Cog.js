var React = require('react')
var clrs = require('colors.css')

var Icon = React.createClass({
  displayName: "Icon",

  getDefaultProps: function() {
    return {
      size: 64,
      d1: 1,
      d2: .6875,
      d3: .375,
      teeth: 8,
      splay: .375,
      fill: 'currentcolor',
      showGuidelines: false // For demonstration
    }
  },

  render: function() {

    var size = this.props.size

    // Center
    var c = size / 2

    // Radii
    var r1 = this.props.d1 * size / 2
    var r2 = this.props.d2 * size / 2
    var r3 = this.props.d3 * size / 2

    // Angle
    var angle = 360 / this.props.teeth
    var offset = 90

    var fill = this.props.fill
    var viewBox = [0, 0, size, size].join(' ')

    var rad = function(a) {
      return Math.PI * a / 180
    }

    var rx = function(r, a) {
      return c + r * Math.cos(rad(a))
    }

    var ry = function(r, a) {
      return c + r * Math.sin(rad(a))
    }

    var num = function(n) {
      return (n < 0.0000001) ? 0 : n
    }

    // Angle offsets to splay tooth
    var ta = angle / 4
    var splay = this.props.splay * ta
    var tw = Math.tan(rad(ta - splay)) * r1

    // Flat tooth end x and y coordinates
    var tx = function(a, w) {
      return Math.sin(rad(a)) * w
    }

    var ty = function(a, w) {
      return Math.cos(rad(a)) * w
    }

    var drawTeeth = function(n) {
      var d = []
      for (var i = 0; i < n; i++) {
        var a = angle * i - offset
        var a1 = a + ta + splay
        var a2 = a + angle - ta - splay
        var line = [
          (i === 0) ? 'M' : 'L',
          num(rx(r1, a) + tx(a, tw)),
          num(ry(r1, a) - ty(a, tw)),
          'L',
          num(rx(r1, a) - tx(a, tw)),
          num(ry(r1, a) + ty(a, tw)),
          'L',
          num(rx(r2, a1)),
          num(ry(r2, a1)),
          'A', r2, r2,
          '0 0 1',
          num(rx(r2, a2)),
          num(ry(r2, a2)),
        ].join(' ')
        d.push(line)
      }
      return d.join(' ')
    }

    var hole = function() {
      return [
        'M', c, c - r3,
        'A', r3, r3,
        '0 0 0',
        c, c + r3,
        'A', r3, r3,
        '0 0 0',
        c, c - r3,
      ].join(' ')
    }

    var pathData = [
      drawTeeth(this.props.teeth),
      hole()
    ].join(' ')

    var guidelines
    if (this.props.showGuidelines) {
      guidelines = React.createElement(Guidelines, React.__spread({},  this.props))
    }

    return (
      React.createElement("svg", {
        xmlns: "http://www.w3.org/svg/2000",
        viewBox: viewBox,
        width: size,
        height: size,
        fill: fill},
        React.createElement("path", {d: pathData}),
        guidelines
      )
    )

  }

})

// Guidelines for Demonstration

var Guidelines = React.createClass({displayName: "Guidelines",

  render: function() {
    var size = this.props.size
    var c = size / 2
    var r1 = this.props.d1 * size / 2
    var r2 = this.props.d2 * size / 2
    var r3 = this.props.d3 * size / 2
    var teeth = this.props.teeth
    var angle = 360 / teeth
    var offset = 90
    var styles = {
      circle: {
        fill: 'none',
        stroke: clrs.red,
        strokeWidth: 1,
        opacity: 0.75
      },
      angles: {
        fill: 'none',
        stroke: clrs.red,
        strokeWidth: 1,
        opacity: 0.75
      },
      subangles: {
        fill: 'none',
        stroke: clrs.red,
        strokeWidth: 1,
        opacity: 0.25
      },
    }

    var rad = function(a) {
      return Math.PI * a / 180
    }

    var rx = function(r, a) {
      return c + r * Math.cos(rad(a))
    }

    var ry = function(r, a) {
      return c + r * Math.sin(rad(a))
    }

    var ta = angle / 4
    var splay = this.props.splay * ta

    var drawAngles = function() {
      var d = []
      for (var i = 0; i < teeth; i++) {
        var a = angle * i - offset
        var line = [
          'M', c, c,
          'L', rx(r1, a), ry(r1, a)
        ].join(' ')
        d.push(line)
      }
      return d.join(' ')
    }

    var drawSubangles = function() {
      var d = []
      for (var i = 0; i < teeth; i++) {
        var a = angle * i - offset
        var a1 = a + ta + splay
        var a2 = a + angle - ta - splay
        var line = [
          'M', rx(r3, a1), ry(r3, a1),
          'L', rx(r1, a1), ry(r1, a1),
          'M', rx(r3, a2), ry(r3, a2),
          'L', rx(r1, a2), ry(r1, a2)
        ].join(' ')
        d.push(line)
      }
      return d.join(' ')
    }

    var path = {
      angles: drawAngles(),
      subangles: drawSubangles()
    }

    return (
      React.createElement("g", null,
        React.createElement("circle", {style: styles.circle, cx: c, cy: c, r: r1}),
        React.createElement("circle", {style: styles.circle, cx: c, cy: c, r: r2}),
        React.createElement("circle", {style: styles.circle, cx: c, cy: c, r: r3}),
        React.createElement("path", {d: path.angles, style: styles.angles}),
        React.createElement("path", {d: path.subangles, style: styles.subangles})
      )
    )
  }
})

module.exports = Icon

