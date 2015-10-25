/**
 * Created by thiago on 24/10/15.
 */
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost:27017/ukepolls');
//27017

var app = express();
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app'))); // ?

// @see http://stackoverflow.com/questions/21821773/configure-node-express-to-serve-static-bower-components
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


//var routes = require('./routes/index.js');
//app.use('/users', users);

// Define API routes for data storage
//app.get('/polls/polls', routes.list);
//app.get('/polls/:id', routes.poll);
//app.post('/polls', routes.create);
var routes = require('./routes/index.js');
app.get('/options', routes.list);
//app.listen(27017);

console.log("aaaa");


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
