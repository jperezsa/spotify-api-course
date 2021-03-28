
'use strict'
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const { find } = require('../models/artist');


function getAlbum(req, res){

    let albumId = req.params.id;
    
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error al obtener el Album'});
        }else{
            if(!album){
                res.status(404).send({message: 'Album no existe'});
            }else{
                res.status(200).send({album: album});
            }
        }
    })
}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if(!artistId){

        var find = Album.find({}).sort('title');

    }else{

        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Error al obtener los Albumes'});
        }else{
            if(!albums){
                res.status(404).send({message: 'Albumes no existe'});
            }else{
                res.status(200).send({albums: albums});
            }
        }
    })
}


function saveAlbum(req, res){
    
    let album = new Album();
    let params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year
    album.image = 'null';
    album.artist = params.artist

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al almacenar el Album'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'Abum no guardado'});
            }else{
                res.status(200).send({album: albumStored});

            }
        }
    })
}

function updateAlbum(req, res){
    
    let albumId = req.params.id;
    let update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar el album'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'Album no actualizado'});
            }else{
                res.status(200).send({album: albumUpdated});

            }
        }

    })
}


function deleteAlbum(req, res) {
    let albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
        }else{
           
            if(!albumRemoved){
                res.status(404).send({message: 'Album no eliminado'});
            }else{

                Song.find({album:albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la cancion'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'Cancion no eliminado'});
                        }else{

                            res.status(200).send({album: albumRemoved});

                        }
                    }

                })
            }

            
        }   
    })
}


function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No upload...';

    if(req.files){
        
        var file_path = req.files.image.path;
        console.log(file_path)
        var file_split  = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'git'){
            
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if(err){
                    res.status(500).send({message : 'Error al actualizar el Album'});
                }else{
                    if(!albumUpdated){
                        
                        res.status(404).send({message : 'No se ha podido actualizar el Album'});
        
                    }else{
                        res.status(200).send({album : albumUpdated});
        
                    }
                }
            })

        }else{
            res.status(200).send({message : 'No image'});

        }
    }
}

function getImageFile(req, res) {

    var imageFile = req.params.imageFile;
    
    var path_file = './upload/albums/' + imageFile;
    console.log(path_file)
    fs.exists(path_file, function (exists) {   

        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message : 'No image'});
        }
        
    })
    
}
module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}