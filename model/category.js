var mongoose            = require('mongoose');
var connection = require('../connect.js');
var db = connection.db;

var CategorySchema = mongoose.Schema({
	 title:String,
	 slug:String,
	 description:String
});
var Category = module.exports = mongoose.model('Category',CategorySchema);