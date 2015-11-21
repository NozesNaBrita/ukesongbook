/**
 * Created by thiago on 25/10/15.
 */
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var dotenv = require('dotenv');
dotenv.load();

// set our port
var port = process.env.PORT || 8080;
// get static files dir
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev';

// connect to Mongo when the app initializes
// use MONGODB if set on .env file or use heroku MONGOLAB plugin on prod
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/' + staticdir)); // set the static files location /public/img will be /img for users

// routes ==================================================
//require('./server/routes/users')(app); // configure our routes
//app.get('api/', function (req, res) {
//	res.send('Hello World!');
//});


var routes = require('./server/routes/api');
app.get('/api/v1/songs', routes.list);

// FACEBOOK
// https://github.com/jaredhanson/passport-facebook
// ================================================================

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: process.env.FACEBOOK_CALLBACK_URL,
		enableProof: false
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		return done(null, profile);
		// @todo to create our own user
		//User.findOrCreate({ facebookId: profile.id }, function (err, user) {
		//	return done(err, user);
		//});
	}
));

app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res){
		// The request will be redirected to Facebook for authentication, so this
		// function will not be called.
	});

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

// start app ===============================================
app.listen(port);
console.log('Starting sever on port ' + port);
exports = module.exports = app;
