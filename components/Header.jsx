
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({

  render: function() {
    return (
      <header className="py3">
        <a href="/" className="bold">Jxnblk</a>
        <h1 className="h2 m0">
          <a href="/writing">
            {this.props.title}
          </a>
        </h1>
        <p>{this.props.description}</p>
      </header>
    )
  }

});

module.exports = Header;

