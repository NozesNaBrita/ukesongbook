/**
 * Created by thiago on 04/10/15.
 * The Option model
 * @see https://gist.github.com/fwielstra/1025038
 */
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema;

var OptionSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true }
}, {collection: 'options'});

module.exports = mongoose.model('Option', OptionSchema, 'options');