var React = require('react');

module.exports = React.createClass({

	getValue: function() {
		return React.findDOMNode(this.refs.siteUrl).value.trim()
	},

	render: function() {
	    return (
	    	<form className="form-inline">
			  <div className="form-group">
			    <div className="input-group">
			      <input ref="siteUrl" type="text" className="form-control" placeholder="URL" defaultValue="http://en.wikipedia.org/wiki/Sonic_the_Hedgehog_(series)"/>
			    </div>
			  </div>
			  <button type="submit" className="btn btn-primary" onClick={this.props.handleUrlSubmit}>Fetch</button>
			  <div>
			  	<img src={this.props.renderImagePath}/>
			  </div>
			</form>
	    )
	}

});