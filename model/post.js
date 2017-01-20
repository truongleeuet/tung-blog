var mongoose            = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var connection = require('../connect.js');
var db = connection.db;
var PostSchema = mongoose.Schema({
	title : String,
	slug : String,
	picture : String,
    category:String,
	catslug:String,
	teaser : String,
	content : String,
	author: String,
	time : String
});

PostSchema.plugin(mongoosePaginate);

var Post = module.exports = mongoose.model('Post', PostSchema);
