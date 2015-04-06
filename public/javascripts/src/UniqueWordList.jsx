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
	    	<div className="list unique-list">
		    	<div>
		    		{
						this.props.wordsUniqueToSite[this.props.selectedLetter].map(function(item, i) {
							return (
								<div 
									onClick={this.handleClick.bind(this, i)} 
									key={item.string} 
									data-match={item.match}
									className={item.className}>
									
									{item.string} 
									{ item.match ? <i>{item.match}</i> : '' }

								</div>
							)
						}, this)
					}
				</div>
			</div>
	    )
	}

});