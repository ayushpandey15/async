// returning all callbacks in promises
exports.add    = add;
exports.mult   = mult;
exports.div    = div; 

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