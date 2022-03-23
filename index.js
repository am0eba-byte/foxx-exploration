'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi'); // imported from npm
const db = require(`@arangodb`).db;
const foxxColl = db._collection(`myFoxxCollection`);
const albumColl = db._collection('albums');
const artistAlbums = db._collection('artistAlbums');
const artistColl = db._collection(`artistColl`);
const aql = require('@arangodb').aql;
const crypto = require('crypto');
import {musicDataWrite, musicDataRead, musicInputDataCheck, musicDataRead} from "./dataAccess/musicDataAccess"
import {newAlbumModel, newArtistModel} from "./dataModels/musicInputModel"

// make a songs collection to connect edges to album


module.context.use(router);


//Albums Collection Routes

// Add album to albumCollection AND create edge from album to artist
router.post('/albums', function(req, res){
    const data = req.body;

let MDW = new musicDataWrite()

let MDIM = new musicInputDataCheck()

    let albumDataModel = new newAlbumModel()
    
    
    if(MDIM.albumExists(data) == true){ // if album exists already, throw error
            // check if the given album already exists in album collection
            
// turn the 404s into "die" methods
        res.status(404)
        res.send("this album already exists in the collection")
    }
    
    if(!data.artist){// check if request album data has an artist prop
     
        res.status(404)
        res.send("album must include artist name")
    }
    
    if(MDIM.artistExists(data) == false){ // check that the req artist's name exists in the artistColl
            // check if the given artist exists in artist collection

        res.status(404)
        res.send("the artist of this album is not in our collection")
    }else{
        res.status(201)
        // res.send(Object.assign(data, meta)); // save the album entry to coll
        res.send(MDW.createAlbum(data)) //fire AQL to insert new edge doc
    }; 

   

    //iii
     // string interpolation


   
    const meta = albumColl.save(req.body); 
    const edgeMeta = edgeColl.save(keys); 
})// new req requirement: all album metadata AND artist existing key (if !exist, throw error)
.body(joi.object().required(), 'Album to store in the collection.')
.response(joi.object().required(), 'Album stored in the collection.')
.summary('Store an album and create new artist-album edge connection.')
.description('Stores an album in "albums" collection and creates new edge from new album to existing artist.')


// Retrieve list of entries from albumCollection using AQL
router.get('/albums', function(req, res){

    let MDR = new musicDataRead()

    res.send(MDR.getAlbums());
})
.response(joi.array().items(
    joi.string().required()
).required(), 'List of album names.')
.summary('List album names')
.description('Assembles a list of album names from the "albums" collection.')


// Artist Collection Routes

// post an artist
router.post(`/artists`, function(req,res){
    const artistData = req.body
let MDW = new musicDataWrite()

 let createArtist = MDW.createArtist(artistData)

    res.send(createArtist);
})
.body(joi.object().required(), 'Artist to store in the collection.')
.response(joi.object().required(), 'Artist stored in the collection.')
.summary('Store an artst')
.description('Stores an artist in "artists" collection.')


// get list of artists
router.get(`/artists`, function(req,res){

    let MDR = new musicDataRead()

    const getArtists = MDR.getArtists()
  
    res.send(getArtists);
})
.response(joi.array().items(
    joi.string().required()
).required(), 'List of artist names.')
.summary('List artist names')
.description('Assembles a list of artist names from the "artists" collection.')



// Get artist by album
router.get('/artists/:artistKEY/albums', function(req, res){
    const artistKEY = req.pathParams.artistKEY
    
    let MDR = new musicDataRead()

   let getArtistbyAlbum = MDR.getArtistByAlbum(artistKEY)

    res.send(getArtistbyAlbum);
})
.response(joi.array().items(
    joi.string().required()
).required(), 'Get artist by album.')
.summary('Retrieve an artist name by album ID.')
.description('Retrieves an artist name by the album ID through an edge relationship.')


// **NOTE**: nuke below edge node .post, transform into 
// new artist .post that creates an edge from the new artist
// to all existing albums that have an artist whose name matches the new artist

// Create artist node and edge node connecting all current DB albums w/ matching artist:name
router.post('/artists', function(req, res){

    let reqArtistData = req.body

    let artistDataModel = new newArtistModel()



    let artistID = req.pathParams.artistKEY
    const edgeColl = `artistAlbums`
    const artistColl = `artistColl`
    const albumColl = `albums`
  

    // const queryAlbum = db._query(aql`
    // FOR album IN ${albumColl}
    // FILTER artist._id == ${artistReq}
    // RETURN NEW album._id
    // `)
    // const queryArtist = db._query(aql`
    // FOR artist IN ${artistColl}
    // FILTER artist._id == ${artistID}
    // RETURN NEW album._id
    // `)

 // FILTER artist.id == album.artist
    const query = db._query(aql`
    FOR album IN albums
  FOR artist IN artistColl
  FILTER album.artist == artist._id
    INSERT {_from: artist._id, _to: album._id} IN artistAlbums
    RETURN NEW
    `)

    const meta = edgeColl.save(query); 
    res.send(Object.assign(query, meta));
    // res.send(Object.assign(queryArtist, meta));
    // edgeColl.save(queryAlbum,queryArtist)
}).response(joi.array().items(
    joi.string().required()
).required(), 'Create an artist-album edge.')
.summary('Create an edge collection connecting an album to an artist.')
.description('Creates a new edge document from an artist to an album.')


/*
const keys = db._query(aql`
    FOR artist IN ${artistColl}
     FILTER artist._key == ${artist._id}
     FOR VERTEX 1 .. 1 INBOUND artist ${artistEdges}
     RETURN VERTEX

    `);
*/


