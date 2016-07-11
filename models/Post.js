/**
 * Created by LYC on 2016/7/7.
 */
var mongodb = require('./db');

 function Post(username,post,time){
        this.user = username;
        this.post = post;
        if(time){
            this.time =time;
        }else{
            this.time = new Date();
        }

 }

Post.find = function(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query ={};
            if(username){
                query.user=username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err,null);
                }
                //封装posts为Post对象
                var posts=[];
                docs.forEach(function(doc,index){
                    var post=new Post(doc.user,doc.post,doc.time);
                    posts.push(post);
                })
                callback(null,posts);
            })
        })

    })
}

Post.prototype.save = function(callback){
    var post={
        user:this.user,
        post:this.post,
        time:this.time
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection("posts",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为user属性添加索引
            collection.ensureIndex("user");
            collection.insert(post,{safe:true},function(err){
                mongodb.close();
                callback(err,post);
            })
        })
    })
}
module.exports=Post;