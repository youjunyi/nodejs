var express = require('express');
var User = require('../models/User');
var Post = require('../models/Post');
var router = express.Router();

/* GET users listing. */
router.get('/u/:user', function(req, res, next) {
  User.find(req.params.user,function(err,user){
      if(!user){
        req.session.error = "用户不存在！"
        return res.redirect('/');
      }
    Post.find(user.name,function(err,posts){
      if(err){
        req.session.error = err;
        return res.redirect('/');
      }
      res.render('user',{
        title:user.name,
        posts:posts
      })
    });
  })
});

module.exports = router;
