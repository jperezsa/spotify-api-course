'use strict'

var express = require('express');

var app = express();
app.use(express.urlencoded());
app.use(express.json());

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');


app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content Type, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GE, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GE, POST, OPTIONS, PUT, DELETE')

    next();
});


app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


module.exports = app;
