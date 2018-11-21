let Promise            = require('bluebird');
let async              = require('async');
const eventEmitter     = require('events');
let fs                 = require('fs');

let services           = require('./services');

exports.waterfallModel = waterfallModel;
exports.autoMaodel     = autoMaodel;
exports.promiseModel   = promiseModel;
exports.asyncModel     = asyncModel;
exports.promisfyModel  = promisfyModel;
exports.eventModel     = eventModel;

function waterfallModel(req,res){
console.log("the body is.....",req.body);
let email      = req.body.email;
let first_name = req.body.first_name;
let last_name  = req.body.last_name;
let password   = req.body.password;
let opts       = {};

async.waterfall([
    function(cb){
        opts={
            email : email
        };
        db.collection('tb_users').find(opts).toArray(function(err,result){
            if(err){
                return cb(err)
            } else if(result.length){
                return cb("EMAIL ALREADY EXIST");
            } else{
                return cb(null);
            }
        })    
    }, function(cb){
        opts ={
            first_name : first_name,
            last_name  : last_name,
            email      : email,
            password   : password
        };
        db.collection('tb_users').insertOne(opts,function(err,result){
            if(err){
                return cb(err);
            } else {
                return cb(null);
            }
        });
    } , function(cb){
        opts ={
            email : email
        };
        db.collection('tb_users').find(opts).toArray(function(err,result){
            if(err){
                return cb(err)
            } 
            delete result[0].password;
            return cb(null,result[0]);
        })        
    }
],function(err,result){
    if(err) {
        return res.status(200).send({status:400,message:"SOMETHING WENT WRONG",data:err});
    } else {
        return res.status(200).send({message :"Inserted Successfully",data:result});
    }
})
}

function autoMaodel(req,res){
    let email      = req.body.email;
    let first_name = req.body.first_name;
    let last_name  = req.body._last_name;
    let password   = req.body.password;
    let opts       = {};
    
    async.auto({
        checkEmail : function(cb){
            opts ={
                email : email
            }
            db.collection('tb_users').find(opts).toArray(function(err,result){
                if(err){
                    return cb(err);
                }
                else if(result.length){
                    return cb("EMAIL ALREADY EXIST");
                } else {
                    return cb(null);
                }
            });
        }, 
        insertUser :['checkEmail',function(user,cb){
            opts ={
                first_name : first_name,
                last_name  : last_name,
                email      : email,
                password   : password
            };
            db.collection('tb_users').insertOne(opts,function(err,result){
                if(err){
                    return cb(err)
                } else{
                    return cb(null);
                }
            });
        }],
        getUsers : ['insertUser',function(user,cb){
            opts ={
                email : email
            };
            db.collection('tb_users').find(opts).toArray(function(err,result){
                if(err){
                    return cb(err)
                } 
                delete result[0].password;
                return cb(null,result[0]);
            })
        }] 
    },function(err,result){
        if(err){
            return res.status(400).send({stats:400,message:"error",data:err});
        } else {            
            return res.status(200).send({message:"INSERTED SUCCESSFULLY",data:result.getUsers});
        } 
    })
}

function promiseModel(req, res){
    let email      = req.body.email;
    let first_name = req.body.first_name;
    let last_name  = req.body._last_name;
    let password   = req.body.password;
    let opts       = {};

    Promise.coroutine(function*(){
        opts={
            email: email
        }
        let checkEmail = yield services.getUserDetails(opts);

        if(checkEmail.length){
            return ({
                status  : 201,
                message : 'EMAIL ALREADY EXIST',
                data    : []
            });
        };

        opts = {
            first_name : first_name,
            last_name  : last_name,
            password   : password,
            email      : email
        }
        
        yield services.insertUser(opts);

        opts = {
            email    : email,
            password : password
        };

        let getUsers = yield services.getUserDetails(opts);

        delete getUsers[0].password;
        delete req.body.password;

        return ({
            status : 200,
            message: "INSERTED SUCCESSFULLY",
            data   : getUsers[0]
        });

        return result;
    })().then((result)=>{
        return res.status(200).send({status:result.status,mesaage:result.message,data:result.data})
    },(error)=>{
        return res.status(400).send({status:400,message:"error",data:error});
    })
}

async function asyncModel(req,res){
    let email      = req.body.email;
    let first_name = req.body.first_name;
    let last_name  = req.body._last_name;
    let password   = req.body.password;
    let opts       = {};

    try{
        opts={
            email: email
        }
        let checkEmail = await services.getUserDetails(opts);
        
        if(checkEmail.length){
           return res.status(200).send({status:200,mesaage:"EMAIL ALREADY EXIST",data:[]});
        };

        opts = {
            first_name : first_name,
            last_name  : last_name,
            password   : password,
            email      : email
        }
        
        await services.insertUser(opts);

        opts = {
            email    : email,
            password : password
        };

        let getUsers = await services.getUserDetails(opts);

        delete getUsers[0].password;
        delete req.body.password;

        
        return res.status(200).send({status:200,mesaage:"successful",data:getUsers[0]});

    } catch(e){
        return res.status(400).send({sttaus:400,message:"error",data:e});
    }    
}

function promisfyModel(req,res){
    let readFile = Promise.promisify(require("fs").readFile);
    console.log("the promisify model");

    readFile('read.txt',"utf-8").then((contents)=>{
        console.log('the reading part is done...',contents);
        return res.status(200).send({status:200,message:"reading is done in promisfy",data:contents});
    }) .catch((e)=>{
        return res.status(400).send({status:400,message:"error",data:e});
    })
}

function eventModel(req,res){
 const e = new eventEmitter();
 
 fs.readFile('./read.txt',(result)=>{
     //In I/O operation the setImmediate fuction call first the callback
     setTimeout(()=>{
         concate("hellow","How r U","setTimeOut");
     },0);
     setImmediate(()=>{
        concate("hellow","How r U","setImmediate");
     })
 })
 

 return res.status(200).send({status:200,message:"successful",data:{}});
}

function  concate(str,str2,method){
    console.log(str + ""+ str2 + ".Calling from "+method);
}