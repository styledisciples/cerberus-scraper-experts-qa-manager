/*jshint esversion: 6 */
/*jshint node: true */

var express = require('express');
var router = express.Router();
var mongo = require("../expert-manager");
var path = require("path");
/* GET home page. */

mongo
	.connect();

router.get('/', function (req, res, next) {
	res.redirect('/tables');
});

router.get('/tables', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.post('/experts', function (req, res, next) {
	mongo.getAllExperts()
		.then(function (experts) {
			var keys = mongo.getUniqueExpertsKeys(experts);
			res.json({
				fieldNames: keys,
				experts: mongo.tablifyExperts(experts)
			});
		})
		.catch(function (error) {
			console.error(error);
			res.send(error);
		});
});

router.post('/results', function (req, res, next) {
	mongo.getResults("scrapy_success_mixed_all")
		.then(function (results) {
			var keys = mongo.getUniqueResultsKeys(results);
			res.json({
				resultFieldNames: keys,
				results: results
			});
		})
		.catch(function (error) {
			console.error(error);
			res.send(error);
		});
});

module.exports = router;