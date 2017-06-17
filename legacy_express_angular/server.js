/**
 * Created by thiago on 25/10/15.
 */
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
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
// passport.use(new FacebookStrategy({
// 		clientID: process.env.FACEBOOK_APP_ID,
// 		clientSecret: process.env.FACEBOOK_APP_SECRET,
// 		callbackURL: process.env.FACEBOOK_CALLBACK_URL,
// 		enableProof: false
// 	},
// 	function(accessToken, refreshToken, profile, done) {
// 		User.findOrCreate({ facebookId: profile.id }, function (err, user) {
// 			return done(err, user);
// 		});
// 	}
// ));

// start app ===============================================
app.listen(port);
console.log('Starting sever on port ' + port);
exports = module.exports = app;
