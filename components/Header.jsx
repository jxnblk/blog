
var React = require('react');

var Header = React.createClass({

  render: function() {
    return (
      <header className="py3">
        <h1 className="h2 m0">
          <a href="/writing" className="link-simple">
            {this.props.title}
          </a>
        </h1>
        <p className="m0">{this.props.description}</p>
      </header>
    )
  }

});

module.exports = Header;

