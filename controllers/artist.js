
'use strict'
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');


function getArtist(req, res){

    let artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error al obtener el artista'});
        }else{
            if(!artist){
                res.status(404).send({message: 'Artista no existe'});
            }else{
                res.status(200).send({artist: artist});
            }
        }
    })
}


function getArtists(req, res) {
    
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1
    }
   
    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error al obtener los artistas'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No existen Artistas'});
            }else{
                
                res.status(200).send({
                    total_items: total,
                    artists: artists
                });

            }
        }
    })
}

function saveArtist(req, res){
    
    let artist = new Artist();
    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al almacenar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'Artista no guardado'});
            }else{
                res.status(200).send({artist: artistStored});

            }
        }
    })
}


function updateArtist(req, res){
    
    let artistId = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'Artista no actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});

            }
        }

    })
}



function deleteArtist(req, res) {
    let artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'Artista no Eliminado'});
            }else{

                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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

                                        res.status(200).send({artist: artistRemoved});

                                    }
                                }

                            })
                        }

                        
                    }   
                })
            }
        }
    })
}


function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No upload...';

    if(req.files){
        
        var file_path = req.files.image.path;
        console.log(file_path)
        var file_split  = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'git'){
            
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if(err){
                    res.status(500).send({message : 'Error al actualizar el usuario'});
                }else{
                    if(!artistUpdated){
                        
                        res.status(404).send({message : 'No se ha podido actualizar el usuario'});
        
                    }else{
                        res.status(200).send({user : artistUpdated});
        
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
    
    var path_file = './upload/artists/' + imageFile;
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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}