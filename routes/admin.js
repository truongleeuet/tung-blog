
var express = require('express');
var fs                  = require('fs');
var multipart           = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
var functions = require('../libs/functions.js');
var Post = require('../model/post');

var Category = require('../model/category');
router.get('/dashboard',function(req,res){
	res.send('abc');
});

router.get('/lists',function(req,res,next){
	 Post.find({},function(err,posts){
     res.render('lists', {posts:posts, functions : functions });
  });
});

router.get('/lists-cat',function(req,res,next){
	 Category.find({},function(err,categories){
     res.render('list-cat', {categories:categories, functions : functions });
  });
});

router.get('/delete/:id',function(req,res,next){
	Post.findById(req.params.id,function(err,result){
		result.remove();
		res.redirect('/admin/lists');
	});
});
router.get('/edit/:id',function(req,res,next){
	Post.findById(req.params.id,function(err,post){
		res.render('edit-post',{ post:post });
	});
});

router.get('/delete-cat/:id',function(req,res,next){
	Category.findById(req.params.id,function(err,result){
		result.remove();
		res.redirect('/admin/lists-cat');
	});
});
router.get('/edit-cat/:id',function(req,res,next){
	Category.findById(req.params.id,function(err,category){
		res.render('edit-category',{ category:category });
	});
});
router.get('/create-category', function(req, res, next) {
  res.render('create-category', { title: 'Create Category' });
});
router.get('/create-post', function(req, res, next) {
	
		 res.render('create-post', { "title": 'Create Post' });
});

router.post('/create-post', multipartMiddleware, function(req, res) {
	var post = new Post;
	post.title = req.body.title;
	post.slug = functions.convertToSlug(req.body.title);
	post.teaser = req.body.teaser;
	post.content = req.body.content;
	post.time = new Date();
	post.category = req.body.category;
	post.catslug = functions.convertToSlug(req.body.category);
	if(req.files.picture){
			var file = req.files.picture;
    
		var originalFilename = file.name;
		var fileType         = file.type.split('/')[1];
		var fileSize         = file.size;
		var pathUpload       = __dirname + '/public/upload/' + originalFilename;

		var data = fs.readFileSync(file.path);
		fs.writeFileSync(pathUpload, data);

		if( fs.existsSync(pathUpload) ) {
			post.picture = originalFilename;
			}
	}
  
	
	console.log(post);
	post.save(function(err, obj) {
		if(!err) {
			res.render('create-post', { status : 'success', message : 'Post successful!' });
			return false;
		}
	});
});

router.post('/edit-post', multipartMiddleware, function(req, res) {
	
	Post.findById(req.query.postId, function(err, post){
		if (post) {
			post.title = req.body.title;
			post.slug = functions.convertToSlug(req.body.title);
			post.teaser = req.body.teaser;
			post.content = req.body.content;
			post.time = new Date();
			post.category = req.body.category;
			post.catslug = functions.convertToSlug(req.body.category);
			if(req.files.picture){
				var file = req.files.picture;
			
				var originalFilename = file.name;
				var fileType         = file.type.split('/')[1];
				var fileSize         = file.size;
				var pathUpload       = __dirname + '/public/upload/' + originalFilename;

				var data = fs.readFileSync(file.path);
				fs.writeFileSync(pathUpload, data);

				if( fs.existsSync(pathUpload) ) {
					post.picture = originalFilename;
			}
			}
			
			post.save(function(err, obj) {
			console.log(obj);
			if(!err) {
				res.render('edit-post', { status : 'success', message : 'Post updated!', post: post });
				return false;
			}
	    });
		}
		
	});
	
});
router.post('/create-category', multipartMiddleware, function(req, res){
	var category = new Category;
	category.title = req.body.title;
	category.slug = functions.convertToSlug(req.body.title);
	category.description = req.body.description;
	category.save(function(err, obj) {
		if(!err) {
			res.render('create-category', { status : 'success', message : 'Category successful!' });
			return false;
		}
	});
});

router.post('/edit-category', multipartMiddleware, function(req, res){
	Category.findById(req.query.catId,function(err, category){
		category.title = req.body.title;
		category.slug = functions.convertToSlug(req.body.title);
		category.description = req.body.description;
		category.save(function(err, obj) {
			if(!err) {
				res.render('edit-category', { status : 'success', message : 'Category successful!',category:category });
				return false;
			}
		});
	});
	
});
module.exports = router;
