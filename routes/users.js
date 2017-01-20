var express = require('express');
var router = express.Router();
//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* Get user listing  */
var User = require('../model/user');

router.get('/',function(req,res){
  res.send('Respond with a resource');
});

router.get('/register',function(req,res){
  res.render('register',{
    'title':'Register'
  });
});

router.get('/login',function(req,res){
  res.render('login',{
    'title':'Login'
  });
});



router.post('/register',function(req,res,next){
  // Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var username= req.body.username;
  var password= req.body.password;
  var password2 = req.body.password2;



    var newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    User.createUser(newUser,function(err,user){
      if(err) throw err;
      console.log(user);
    });

    res.redirect('/');
 

});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username,password,done){
    User.getUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
        console.log('Unknown User');
        return done(null, false,{message: 'Unknown User'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        } else{
          console.log('Invalid Password');
          return done(null,false,{message: 'Invalid Password'});
        }
      });
    });
  }
));
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'}),function(req,res){
  console.log('Authentication success');
 
  res.redirect('/');
});

router.get('/logout',function(req,res){
  req.logout();

  res.redirect('/users/login');
});
module.exports = router;