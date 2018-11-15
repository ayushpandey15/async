let Promise            = require('bluebird');
let async              = require('async');
let readFile           = Promise.promisify(require("fs").readFile);
const eventEmitter     = require('events');

let services           = require('./services');

exports.waterfallModel = waterfallModel;
exports.autoMaodel     = autoMaodel;
exports.promiseModel   = promiseModel;
exports.asyncModel     = asyncModel;
exports.promisfyModel  = promisfyModel;
exports.eventModel     = eventModel;

function waterfallModel(req,res){
console.log("the body is.....",req.body);
let num1 = req.body.first_no;
let num2 = req.body.second_no;

async.waterfall([
    function(cb){
        let c= num1 + num2
        console.log("the addition is...",c);
        return cb(null,{sum:c});

    }, function(result,cb){
        let c = num1 * num2;
        result.multi = c;
        return cb(null,result);

    } , function(result,cb){
        let c = num1/num2;
        result.div = c;
        return cb(null,result);
    }
],function(err,result){
    if(err) {
        return res.status(400).send(err);
    } else {
        return res.status(200).send(result);
    }
})
}

function autoMaodel(req,res){
    console.log("tyhe body is.....",req.body);
    let num1 = req.body.first_no;
    let num2 = req.body.second_no;

    async.auto({
        addition : function(cb) {
            return cb(null,(num1+num2))
        } ,
        multi : function(cb){
            return cb(null,(num1*num2));
        },
        div : ['addition','multi',function(result,cb){            
            let c = Number((num1/num2).toFixed(4));            
             return cb(null,c);
        }] 
    },function(err,result){
        if(err){
            return res.status(400).send(JSON.stringify(err));
        } else {            
            return res.status(200).send(result);
        } 
    })
}

function promiseModel(req, res){
    let num1   = req.body.first_no;
    let num2   = req.body.second_no;
    let result = {};

    Promise.coroutine(function*(){
        
        let add = yield services.add(num1,num2);
        
        let mul = yield services.mult(num1,num2);

        let div = yield services.div(num1,num2);
        
        result = {
            sum      : add,
            multiply : mul,
            div      : div
        };

        return result;
    })().then((result)=>{
        return res.status(200).send({status:200,mesaage:"successful",data:result})
    },(error)=>{
        return res.status(400).send({sttaus:400,message:"error",data:error});
    })
}

async function asyncModel(req,res){
    let num1   = req.body.first_no;
    let num2   = req.body.second_no;
    let result = {};

    try{
        let add = await services.add(num1,num2);
        
        let mul = await services.mult(num1,num2);

        let div = await services.div(num1,num2);

        result = {
            sum      : add,
            multiply : mul,
            div      : div
        };
        return res.status(200).send({status:200,mesaage:"successful",data:result});

    } catch(e){
        return res.status(400).send({sttaus:400,message:"error",data:e});
    }    
}

function promisfyModel(req,res){
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
 
 console.log("start");

 setImmediate(()=>{
     console.log("setImmediate: the setImmediate Function running");
 });

 e.on('event-1',()=>{
     console.log(1);
   });

  e.on('event-2',()=>{
    console.log(2);
   });

  e.on('event-3',()=>{
    console.log(3);
 });

 e.emit('event-1');
 e.emit('event-2');
 e.emit('event-3');

 console.log('end');

 return res.status(200).send({status:200,message:"successful",data:{}});
}