var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Uke Songbook' });
});



// --
var Option = require('../models/Option.js');

//module.exports = router;

exports.list = function(req, res) {
  console.log('asdasd');
  Option.find(function(err, options) {
    console.log(err);
    console.log(options);
    res.json(options);
  });
};


//var OptionSchema = require('../models/Option.js').OptionSchema;
//var Option = db.model('options', OptionSchema);
////exports.index = function(req, res) {
////  res.render('index', {title: 'Polls'});
////};
//// JSON API for list of polls
//exports.list = function(req, res) {
//  Option.find(function(error, options) {
//    console.log('asd');
//    res.json(options);
//  });
//};


//// JSON API for getting a single poll
//exports.poll = function(req, res) {
//  var pollId = req.params.id;
//  Poll.findById(pollId, '', { lean: true }, function(err, poll) {
//    if(poll) {
//      var userVoted = false,
//          userChoice,
//          totalVotes = 0;
//      for(c in poll.choices) {
//        var choice = poll.choices[c];
//        for(v in choice.votes) {
//          var vote = choice.votes[v];
//          totalVotes++;
//          if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
//            userVoted = true;
//            userChoice = { _id: choice._id, text: choice.text };
//          }
//        }
//      }
//      poll.userVoted = userVoted;
//      poll.userChoice = userChoice;
//      poll.totalVotes = totalVotes;
//      res.json(poll);
//    } else {
//      res.json({error:true});
//    }
//  });
//};
//// JSON API for creating a new poll
//exports.create = function(req, res) {
//  var reqBody = req.body,
//      choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
//      pollObj = {question: reqBody.question, choices: choices};
//  var poll = new Poll(pollObj);
//  poll.save(function(err, doc) {
//    if(err || !doc) {
//      throw 'Error';
//    } else {
//      res.json(doc);
//    }
//  });
//};


