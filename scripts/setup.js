`use strict`;
const db = require(`@arangodb`).db;
const collectionName = `myFoxxCollection`;
const albumCollection = 'albums';

if(!db._collection(collectionName)){
    db._createDocumentCollection(collectionName);
}

if(!db._collection(albumCollection)){
    db._createDocumentCollection(albumCollection);
}