
'use strict'
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');



function getSong(req, res){

    let songId = req.params.id;
    
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error al obtener la cancion'});
        }else{
            if(!song){
                res.status(404).send({message: 'Cancion no existe'});
            }else{
                res.status(200).send(song);
            }
        }
    })
}

function getSongs(req, res) {
    var albumId = req.params.album;

    if(!albumId){

        var find = Song.find({}).sort('number');

    }else{

        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
            path: 'album',
            populate: {
                path: 'artist',
                model:'Artist'
            }
        }).exec((err, songs) => {

        if(err){
            res.status(500).send({message: 'Error al obtener las canciones'});
        }else{
            if(!songs){
                res.status(404).send({message: 'Canciones no existen'});
            }else{
                res.status(200).send({songs: songs});
            }
        }
    })
}


function saveSong(req, res){
    
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error al almacenar la cancion'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'Cancion no guardada'});
            }else{
                res.status(200).send({song: songStored});

            }
        }
    });
}

function updateSong(req, res){
    
    let songId = req.params.id;
    let update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar la cancion'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'Cancion no actualizada'});
            }else{
                res.status(200).send({song: songUpdated});

            }
        }

    })
}


function deleteSong(req, res) {
    let songId = req.params.id;
    
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar cancion'});
        }else{
           
            if(!songRemoved){
                res.status(404).send({message: 'Cancion no eliminado'});
            }else{

                res.status(200).send({song: songRemoved});

            
            }
        }   
    })
}


function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No upload...';

    if(req.files){
        
        var file_path = req.files.file.path;
        var file_split  = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'wav'){
            
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, sonUpdated) => {
                if(err){
                    res.status(500).send({message : 'Error al actualizar la Cancion'});
                }else{
                    if(!sonUpdated){
                        
                        res.status(404).send({message : 'No se ha podido actualizar la Cancion'});
        
                    }else{
                        res.status(200).send({song : sonUpdated});
        
                    }
                }
            })

        }else{
            res.status(200).send({message : 'No song'});

        }
    }
}

function getSongFile(req, res) {

    var songFile = req.params.songFile;
    
    var path_file = './upload/songs/' + songFile;
    console.log(path_file)
    fs.exists(path_file, function (exists) {   

        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message : 'No Song'});
        }
        
    })
    
}

module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}