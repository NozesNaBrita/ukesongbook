/**
 * Created by thiago on 25/10/15.
 */
var express = require("express");
var router = express.Router();

var Song = require('../models/Song.js');
console.log('server/routes/api.js');
console.log(Song);
exports.list = function(req, res) {
	console.log('----songs---');
	Song.find(function(err, songs) {
		console.log(err);
		console.log(songs);
		res.json(songs);
	});
};
