const express        = require('express');

let  app             =  express();
let bodyParser       = require('body-parser');

let controller       = require('./controller');
let validator        = require('./validator');
let mongo            = require('./connection');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.post('/waterfallModel',validator.validator,controller.waterfallModel);
app.post('/autoModel',validator.validator,controller.autoMaodel);
app.post('/promiseModel',validator.validator,controller.promiseModel);
app.post('/asyncModel',validator.validator,controller.asyncModel);
app.get('/promisifyModel',controller.promisfyModel);
app.get('/eventModel',controller.eventModel);

let server = require('http').createServer(app);
let PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{    
    console.log(`the port is listening on.......... ${PORT}`);
    mongo.start_con();   
});
