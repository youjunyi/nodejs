/**
 * Created by LYC on 2016/7/6.
 */
var express = require('express');
var crypto  =  require('crypto');
var User  =  require('../models/User');
var router = express.Router();

router.get('/', function (req, res, next){
    res.render('login', { title: '登录' });
})
router.post('/',function(req, res, next){
    var md5 = crypto.createHash('md5');
    var password=md5.update(req.body.password).digest("base64");
    User.find(req.body.username,function(err,user){
        if(!user){
            req.session.error="用户不存在！";
            return res.redirect('/login');
        }
        if(user.password!=password){
            req.session.error="用户或密码错误！";
            return res.redirect('/login');
        }
        req.session.user = user;
        req.session.success="登录成功";
        return res.redirect('/');
    })
})

router.get('/loginout',function(req, res){
    req.session.user = null;
    req.session.success="退出成功";
    return res.redirect('/');
})
module.exports = router;
