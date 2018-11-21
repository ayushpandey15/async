exports.start_con = start_con;

function start_con(){ 
    
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    const url = 'mongodb://localhost:27017';
    
  // Database Name
  const dbName = 'users';
  
  
   
  // Use connect method to connect to the server
  MongoClient.connect(url,{useNewUrlParser: true}, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to database server");
   const dbo=client.db(dbName);
    global.db = dbo;
   // created schema
   //model.createModel();
  });
  
  }