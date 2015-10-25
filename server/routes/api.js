/**
 * Created by thiago on 25/10/15.
 */
var express = require("express");
var router = express.Router();

var Option = require('../models/Option.js');
console.log(Option);
exports.list = function(req, res) {
	console.log('----options---');
	Option.find(function(err, options) {
		console.log(err);
		console.log(options);
		res.json(options);
	});
};