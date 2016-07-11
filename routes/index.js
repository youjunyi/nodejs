var express = require('express');
var Post = require('../models/Post');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find(null,function(err,posts){
        if(err){
            posts = [];
        }
        res.render('index', {
            title: '首页',
            posts:posts
        });
    })

});
router.post('/post',function(req, res, next){
    var cuser = req.session.user;
    var post = new Post(cuser.name,req.body.post);
    post.save(function(err){
        if(err){
            req.session.error="发布信息失败！" ;
           return  res.redirect('/');
        }
        req.session.success="发布成功";
        res.redirect('/u/'+cuser.name);
    });
 })
module.exports = router;
