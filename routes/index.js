
var express = require('express');
var mongoose            = require('mongoose');
var url = require('url');
var connection = require('../connect.js');
var db = connection.db;
var router = express.Router();
var Post = require('../model/post');
var functions = require('../libs/functions.js');
var paginate = require('express-paginate');
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({},function(err,posts){
     posts = posts.sort({'id' : 1});
     res.render('index', { title: 'Blog của Tùng',posts:posts, functions : functions });
  });
 
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Giới Thiệu' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Liên Hệ' });
});

router.get('/detail/:slug',function(req,res,next){
  if (req.params.slug != 'favicon.ico') {
    Post.findOne({'slug':req.params.slug},function(err,post){

     res.render('single',{ post : post,title:post.title});
   });
  }
});
router.get('/category/:category',function(req, res, next){
  var url_parts = url.parse(req.url, true);
  console.log(url_parts);
  var page = url_parts.query.page || 1;
  console.log('page:', page);
  var limit = url_parts.query.limit || 2;
  console.log(req.params.category);
  Post.paginate({'catslug':req.params.category}, { page: page, limit: parseInt(limit) }, function(err, result) {
    console.log(page);
  console.log(result);
    if (err) return next(err);
 
    res.format({
      html: function() {
        res.render('category', {
          posts: result.docs,
          functions : functions,
          pageCount: result.pages,
          title:result.docs.title,
          // itemCount: itemCount,
          pages: paginate.getArrayPages(req)(3, result.pages, req.query.page)
        });
      },
      json: function() {
        // inspired by Stripe's API response for list objects 
        res.json({
          object: 'list',
          // has_more: paginate.hasNextPages(req)(pageCount),
          data: result
        });
      }
    });
 
  });
 
});

module.exports = router;
