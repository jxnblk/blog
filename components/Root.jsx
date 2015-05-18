
var React = require('react');
var Head = require('./Head.jsx');
var Body = require('./Body.jsx');

var Root = React.createClass({

  render: function() {
    return (
      <html>
        <Head {...this.props} />
        <Body {...this.props} />
      </html>
    )
  }

});

module.exports = Root;

