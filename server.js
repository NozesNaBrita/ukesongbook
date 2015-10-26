/**
 * Created by thiago on 25/10/15.
 */
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var port = process.env.PORT || 8080; // set our port
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev'; // get static files dir

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost:27017/ukepolls');
//27017

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

passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://dev.ukesongbook:8080/auth/facebook/callback",
		enableProof: false
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ facebookId: profile.id }, function (err, user) {
			return done(err, user);
		});
	}
));

// start app ===============================================
app.listen(port);                   // startup our app at http://localhost:8080
console.log('Starting sever on port ' + port);       // shoutout to the user
exports = module.exports = app;             // expose app