
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({

  render: function() {
    return (
      <header className="py3">
        <h1>
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

