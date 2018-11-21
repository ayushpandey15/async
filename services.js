// returning all callbacks in promises
exports.add              = add;
exports.mult             = mult;
exports.div              = div;
exports.getUserDetails  = getUserDetails;
exports.insertUser       = insertUser;

function add(num1,num2){
    return new Promise((resolve,reject)=>{
        if(typeof(num1) == undefined || typeof(num2) == undefined ){
            return reject("parameter missing")
        }
        let c= num1+num2;
        return resolve(c)
    });
}

function mult(num1,num2){
    return new Promise((resolve,reject)=>{
        if(typeof(num1) == undefined || typeof(num2) == undefined){
            return reject("parameter missing")
        }
        let c= num1*num2;
        return resolve(c)
    });
}

function div(num1,num2){
    return new Promise((resolve,reject)=>{
        if(typeof(num1) == undefined || typeof(num2) == undefined ){
            return reject("parameter missing")
        }
        let c= num1/num2;
        return resolve(c)
    });
}

function getUserDetails(opts){
    return new Promise((resolve,reject)=>{
        if(!opts.email){
            return reject("INVALID EMAIL");
        }
        db.collection('tb_users').find(opts).toArray(function(err,result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });

    });
}

function insertUser(opts){
    return new Promise((resolve,reject)=>{
        db.collection('tb_users').insertOne(opts,function(err,result){
            if(err){
                return reject(err)
            }
            return resolve();
        });
    });
}
