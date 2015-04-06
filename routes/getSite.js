var express = require('express');
var router = express.Router();
var phantom = require("phantom");
var tm = require('text-miner');
var _ = require('lodash');
var slug = require('slug');
var my_corpus;
var dataObj = {};
var htmlData;
var terms;
var freqterms;

router.post('/getSite', function (req, res, next) {

	console.log(req.body.siteUrl);
	my_corpus = null;
	terms = null;
	dataObj = null;
	phantom.create(function (ph) {
		ph.createPage(function (page) {
			page.set('viewportSize', { width : 1800, height : 800});
			page.onConsoleMessage = function (msg) {
				console.log('onConsoleMessage')
				console.log(msg);
			};
			page.open(req.body.siteUrl, function (status) {
				console.log('page.open: ' + status);

			  	setTimeout(function() {
					return page.evaluate(function() {
						document.body.bgColor = 'white';
						var pageElements;
						if (document.querySelectorAll('[role=main]').length) {
							pageElements = document.querySelectorAll('[role=main] > *:not(script)');;	
						} else {
							pageElements = document.querySelectorAll('body > *:not(script)');;	
						}
						
						var stringElements = [].map.call(pageElements, function(el){
							var innerHTML = el.innerHTML;
							innerHTML = innerHTML.replace(/\W+/g, ' ')
							return innerHTML;
						});

						var pageHTML = document.getElementsByTagName('html')[0].innerHTML;

						var fullString = stringElements.toString() + 'jjaacckkbbiisshhoopp' + pageHTML.toString();
						return fullString;

		          }, function(data) {
						if (data && data.indexOf('jjaacckkbbiisshhoopp') != -1) {
							// console.log('data strings: ' +data.split('|j|a|c|k|')[0])
							// console.log('data HTML: ' +data.split('|j|a|c|k|')[1]);
							// console.log(tm.STOPWORDS);

							var dataStrings = data.split('jjaacckkbbiisshhoopp')[0];
							var dataHTML = data.split('jjaacckkbbiisshhoopp')[1];

							var my_corpus = new tm.Corpus([]);
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
							page.render('public/fetched-images/' + imageName + '_render_a.jpeg', {format: 'jpeg', quality: '100'});

							dataObj = {};
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

						ph.exit();

		          });
		        }, 500);

			});
		});
	});

});

module.exports = router;