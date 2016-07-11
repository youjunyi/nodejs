/**
 * Created by LYC on 2016/7/7.
 */

var mongodb = require('./db');
 function User(user){
    this.name = user.name;
     this.password = user.password;
 };

User.find = function(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name:username},function(err,doc){
                mongodb.close();
                if(doc){
                    //封装文档为User对象
                    var user=new User(doc);
                    callback(err,user);
                }else{
                    callback(err,null);
                }

            })
        })

    })
}

//将User类给予接口
module.exports=User;
User.prototype.save = function save(callback){
    var user ={
       name : this.name,
       password:this.password
    };
    mongodb.open(function(err,db){
        if(err){
            callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('name',{unique:true})

            collection.insert(user,{safe:true},function(err){
                mongodb.close();
                callback(err);
            })
        })
    })
}