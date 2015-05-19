
var React = require('react');
var Jxnblk = require('jxnblk-avatar');

var Footer = React.createClass({

  render: function() {
    return (
      <footer className="center py4 border-top">
        <a href="/" className="bold link-simple">
          <Jxnblk width={64} height={64} />
          <div>Made by Jxnblk</div>
        </a>
      </footer>
    )
  }

});

module.exports = Footer;

