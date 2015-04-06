var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
	
	mixins: [PureRenderMixin],

	componentWillReceiveProps: function(nextProps) {
    	console.log('componentWillReceiveProps')
    	console.log(nextProps);
    },

	componentDidMount: function() {
		console.log('componentDidMount')
	},

	handleClick: function(i) {
   		console.log('You clicked: ' + this.props.words[i]);
  	},

	render: function() {
	    return (
	    	<div className="loading">
		    	{
		    		this.props.on ? <img src="images/360.gif"/> : '',
		    		this.props.error ? <p className="has-error error">{this.props.error}</p> : ''
		    	}
			</div>
	    )
	}

});