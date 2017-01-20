var express = require('express');
var mongoose            = require('mongoose');
mongoose.connect('mongodb://localhost/tungblog');
var db = mongoose.connection;
exports.db = db;