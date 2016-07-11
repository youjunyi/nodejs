/**
 * Created by LYC on 2016/7/6.
 */
var express = require('express');
var crypto  =  require('crypto');
var User = require('../models/User');
var router = express.Router();

router.get('/',function(req, res, next){
    res.render('reg', { title: '注册' })
})
router.post('/',function(req, res, next){
    if(req.body['password']!=req.body['password-repeat']){
        req.session.error="两次输入密码不一致！"
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password=md5.update(req.body.password).digest("base64");
    var nawuser = new User({
        name:req.body.username,
        password:password
    })
    User.find(nawuser.name,function(err,user){
        if(user){
            req.session.error="用户已经存在！"
            return res.redirect('/reg');
        }
        nawuser.save(function(err){
            if(err){
                req.session.error=err;
                return res.redirect('/reg');
            }
            req.session.user = nawuser;
            req.session.success = "注册成功";
            return res.redirect('/');
        });
    })
})

module.exports = router;