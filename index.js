'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;


mongoose.connect('mongodb://localhost:27017/spotify', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
} ,

(err, res) => {


    if(err){
        throw err;
    }else {
        console.log("BD Mongo OK!")
        app.listen(port, function(){
            console.log("Server Listen on port: " + port);
        })
    }
})