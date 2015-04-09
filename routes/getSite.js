var express = require('express');
var router = express.Router();
var phantom = require("phantom");
var tm = require('text-miner');
var _ = require('lodash');
var slug = require('slug');
var phantomService = null;
var phantomPage = null;
var tokenReplace = 'jjaacckkbbiisshhoopp';

router.post('/getSite', function (req, res, next) {

	phantomService = null;
	phantomPage = null;

	console.log('Requested site: ' + req.body.siteUrl);

	phantom.create(function (ph) {

		phantomService = ph;

		ph.createPage(function (page) {
			phantomPage = page;
			phantomPage.set('viewportSize', { width : 1800, height : 800});

			phantomPage.onConsoleMessage = function (msg) {
				console.log('onConsoleMessage')
				console.log(msg);
			};

			phantomPage.open(req.body.siteUrl, function (status) {
				
				console.log('Status for page.open: ' + status);

			  	setTimeout(function() { analyzeSiteHTML(req, res, next) }, 1000);

			});
		});
	});

});


function analyzeSiteHTML(req, res, next) {
	
	if (phantomPage) {
	
		return phantomPage.evaluate(function() {
			
			var stringElements;
			var pageElements;

			console.log('error2?')
			document.body.bgColor = 'white';
			if (document.querySelectorAll('[role=main]').length) {
				pageElements = document.querySelectorAll('[role=main] > *:not(script)');;	
			} else {
				pageElements = document.querySelectorAll('body > *:not(script)');;	
			}
			
			stringElements = [].map.call(pageElements, function(el){
				var innerHTML = el.innerHTML;
				innerHTML = innerHTML.replace(/\W+/g, ' ')
				return innerHTML;
			});

			var pageHTML = document.getElementsByTagName('html')[0].innerHTML;

			console.log(pageHTML);

			var fullString = stringElements.toString() + 'jjaacckkbbiisshhoopp' + pageHTML.toString();
			return fullString;
			// return "test" + tokenReplace + "thetest";

		}, function(data) {
				
			var dataObj = {};
			var my_corpus = null;
			var terms = null;
			var freqterms = null;

			if (data && data.indexOf('jjaacckkbbiisshhoopp') != -1) {

				var dataStrings = data.split('jjaacckkbbiisshhoopp')[0];
				var dataHTML = data.split('jjaacckkbbiisshhoopp')[1];

				my_corpus = new tm.Corpus([]);
				my_corpus.addDoc(dataStrings)
				my_corpus.removeNewlines()
				my_corpus.trim()
				my_corpus.removeDigits()
				my_corpus.removeInvalidCharacters()
				my_corpus.toLower()
				my_corpus.removeWords(['a','an','it','as','the','then','and','at','about', 'be'])

				terms = new tm.Terms(my_corpus);
				
				var imageName = slug(req.body.siteUrl);
				// page.render('public/fetched-images/' + imageName + '_render_' + req.body.selectedLetter + '.jpeg', {format: 'jpeg', quality: '100'});
				phantomPage.render('public/fetched-images/' + imageName + '_render_a.jpeg', {format: 'jpeg', quality: '100'});

				var sortedTermsCounts = terms.dtm[0].sort(function(a, b){ return b - a; });
				dataObj.combined = [].map.call(sortedTermsCounts, function(item, index) {
					return { word: terms.vocabulary[index], freq: item }
				})

				dataObj.terms = terms;
				dataObj.freqterms = {};
				dataObj.renderImagePath = 'fetched-images/' + imageName + '_render_a.jpeg';

				dataObj.combined.forEach(function(item){
					dataObj.freqterms[item.word] = item.freq;
				});

				dataObj.fullData = '<html>' + dataHTML + '</html>';

				console.log('dataObj:'+sortedTermsCounts)

				res.status(200).send({
					selectedLetter: req.body.selectedLetter,
					message: 'OK', 
					dtm: dataObj.terms.dtm,
					vocab: dataObj.terms.vocabulary,
					combined: dataObj.combined,
					freqterms: dataObj.freqterms,
					fullData: dataObj.fullData,
					renderUrl: req.body.siteUrl,
					renderImagePath: dataObj.renderImagePath
				});
			} else {
				dataObj = null;
				res.status(500).send({ message: "NOT OK" });
			}

			phantomService.exit();

		});

	}

}


module.exports = router;