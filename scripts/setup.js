`use strict`;
const db = require(`@arangodb`).db;
const collectionName = `myFoxxCollection`;
const albumCollection = 'albums'; // album document collection
const artistAlbums = 'artistAlbums'; //artist-album edges collection
const artistColl = `artistColl` // artist collection

if(!db._collection(collectionName)){
    db._createDocumentCollection(collectionName);
}

if(!db._collection(albumCollection)){
    db._createDocumentCollection(albumCollection);
}

if(!db._collection(artistAlbums)){
    db._createEdgeCollection(artistAlbums);
};

if(!db._collection(artistColl)){
    db._createDocumentCollection(artistColl);
};