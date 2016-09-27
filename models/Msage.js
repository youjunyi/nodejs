/**
 * Created by LYC on 2016/9/22.
 */
var mongodb = require('./db');

function Msage(masge){
    this.userid = masge.userid;
    this.username = masge.username;
    this.counents = masge.counents;
    this.touserid = masge.touserid;
};

Msage.find = function(userid,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('msage',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query ={};
            if(userid){
                query.msage=userid;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err,null);
                }
                //封装posts为Post对象
                var posts=[];
                docs.forEach(function(doc,index){
                    var masge=new Msage(doc.user,doc.post,doc.time);
                    posts.push(masge);
                })
                callback(null,posts);
            })
        })

    })
}


//将User类给予接口
module.exports=Msage;
Msage.prototype.save = function save(callback){
    var msage ={
        userid:this.userid,
        username:this.username,
        counents:this.counents,
        touserid : this.touserid
    };
    mongodb.open(function(err,db){
        if(err){
            callback(err);
        }
        db.collection('msage',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('name',{unique:true})

            collection.insert(msage,{safe:true},function(err){
                mongodb.close();
                callback(err);
            })
        })
    })
}