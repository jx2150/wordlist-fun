var React = require('react');
var WordList = require('./WordList.jsx');
var UniqueWordList = require('./UniqueWordList.jsx');
var Site = require('./Site.jsx');
var Loading = require('./Loading.jsx');
var mountNode = document.getElementById('wordlist');
var $ = require('../../libraries/jquery/dist/jquery.min.js')
var wordsObj = {'a': [],'b': [],'c': [],'d': [],'e': [],'f': [],'g': [],'h': [],'i': [],'j': [],'k': [],'l': [],'m': [],'n': [],'o': [],'p': [],'q': [],'r': [],'s': [],'t': [],'u': [],'v': [],'w': [],'x': [],'y': [],'z': []};

var App = React.createClass({

	getInitialState: function() {
		return {
			selectedLetter: 'a',
			message: 'OK', 
			dtm: [],
			vocab: [],
			combined: [],
			freqterms: {},
			fullData: '',
			renderUrl: '',
			renderImagePath: '',
			words: words['a'],
			loading: false,
			error: false,
			wordsUniqueToSite: []
		}
	},

	selectLetter: function(letter) {
  		var self = this;
  		this.setState({
  			selectedLetter: letter,
  			loading: true,
  			error: false
  		}, function() {
  			self.updateWordSort(this.state);
  		});
  	},

	handleUrlSubmit: function(e) {
		var self = this;
  		if (e) { e.preventDefault(); }
  		console.log('post URL: ' + this.refs.siteUrl.getValue())
  		
  		this.setState({
  			loading: true,
  			error: false
  		});

  		$.ajax({
			url: 'getSite',
			dataType: 'json',
			type: 'POST',
			data: {
				siteUrl: this.refs.siteUrl.getValue(),
				selectedLetter: this.state.selectedLetter
			},
			success: function(data) {
				console.log('got data')
				this.updateWordSort(data);
			}.bind(self),
			error: function(xhr, status, err) {
				console.error(this.state.renderUrl, status, err.toString());
				this.setState({
					loading: false,
					error: err.toString()
				});
			}.bind(self)
	    });
  	},

  	updateWordSort: function(data) {
		var termsFromSite = Object.keys(data.freqterms).filter(function(item){ return item.trim().length });
		
		var matchedWords = words[this.state.selectedLetter].map(function(item) {
			var newItem = item;
			var itemString = newItem.string.toLowerCase()
			var value = data.freqterms[itemString];
			var className = '';

			if (value === undefined) {
				value = 0;
			}
			
			if (value > 0) {
				className = 'match match-'+value;
				//maintain set of unique site words not in /dict/words
				// uniqueTermsFromSite = uniqueTermsFromSite.splice(uniqueTermsFromSite.indexOf(itemString), 1);
			}

			newItem.match = value;
			newItem.className = className;

			return newItem;
		});

		// var sortedWords = words[this.state.selectedLetter].sort(function(a, b) {
		var sortedWords = matchedWords.sort(function(a, b) {
			return b.match - a.match
		});

		// data.words = words;
		data.wordsUniqueToSite = this.getTermsUniqueToSite.call(this, termsFromSite, data.freqterms);
		data.words = sortedWords;
		data.loading = false;
		data.error = false;

		this.setState(data);
		// return data;
  	},

  	getTermsUniqueToSite: function(termsFromSite, countHash) {
  		var self = this;
  		var termsUniqueToSite = termsFromSite;
  		var wordSet = self.state.words;
  		var firstLetter;
  		// var returnObj = wordsObj;
  		var returnObj = [];

  		termsUniqueToSite = termsUniqueToSite.sort(function(a, b) {
			return countHash[b] - countHash[a]
		});
  		
  		// wordLetterArray.forEach(function(letter) {
  		// 	var wordSet = self.state.words[letter];
	  		wordSet.forEach(function(word){
	  			var wordString = word.string.toLowerCase();
	  			if (countHash[wordString]) {
	  				termsUniqueToSite.splice(termsUniqueToSite.indexOf(wordString), 1);
	  			}
	  		});
  		// });

  		termsUniqueToSite.forEach(function(word) {
  			firstLetter = word.charAt(0).toLowerCase();
  			if (firstLetter.length === 1 && firstLetter.match(/[a-z]/i) && firstLetter === self.state.selectedLetter) {
	  			// returnObj[firstLetter].push({
	  			returnObj.push({
	  				className: "unmatch unmatch-"+countHash[word],
					match: countHash[word],
					string: word
	  			});
	  		}
  		});
	  	
	  	return returnObj;
  	},

	render: function() {
	    return (
	    	<div>
	    		<Loading
	    			on={this.state.loading}
	    			error={this.state.error}/>
				<Site 
					renderUrl={this.state.renderUrl} 
					handleUrlSubmit={this.handleUrlSubmit} 
					renderImagePath={this.state.renderImagePath}
					ref="siteUrl"/>
				<WordList 
					selectedLetter={this.state.selectedLetter} 
					selectLetter={this.selectLetter} 
					combined={this.state.combined}
					words={this.state.words}/>
				<UniqueWordList
					selectedLetter={this.state.selectedLetter} 
					wordsUniqueToSite={this.state.wordsUniqueToSite}/>
			</div>
		)
	}
});

React.render(
	<App/>,
	mountNode
);