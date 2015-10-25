/**
 * Created by thiago on 04/10/15.
 * The Song model
 * @see https://gist.github.com/fwielstra/1025038
 */
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema;

var SongSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true }
}, {collection: 'songs'});

module.exports = mongoose.model('Song', SongSchema, 'songs');