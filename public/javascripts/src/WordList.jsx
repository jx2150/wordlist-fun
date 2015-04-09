var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Perf = require('react/addons').addons.Perf;
var a_to_z = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(',')

module.exports = React.createClass({
	
	// mixins: [PureRenderMixin],

	componentWillReceiveProps: function(nextProps) {
    	console.log('WordList: componentWillReceiveProps')
    	console.log(nextProps);
    },

	componentDidMount: function() {
		console.log('WordList: componentDidMount')
	},

	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	console.log(nextProps);
	// 	console.log(nextState);
	// 	return nextProps.selectedLetter !== this.props.selectedLetter;
	// },

	handleClick: function(i) {
   		console.log('WordList: You clicked: ' + this.props.words[this.props.selectLetter][i]);
  	},

	render: function() {
	    return (
	    	<div>
	    		{
		    		a_to_z.map(function(item, i) {
		    			return (
		    				<button 
		    					className={this.props.selectedLetter === item ? 'btn btn-primary' : ''}
		    					onClick={this.props.selectLetter.bind(this, item)} 
		    					key={item}>

		    					{item}

		    				</button>
		    			)
		    		}, this)
	    		}
		    	<div className="list">
		    		{
						this.props.words.map(function(item, i) {
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