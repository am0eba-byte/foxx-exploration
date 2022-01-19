'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi'); // imported from npm
const db = require(`@arangodb`).db;
const foxxColl = db._collection(`myFoxxCollection`);
const albumColl = db._collection('albums')
const aql = require('@arangodb').aql;

module.context.use(router);

// Getting-Started tutorial

//Basic Hello World route
router.get('/hello-world', function (req, res){
    res.send('Hello World');
}
)
.response(['text/plain'], 'A generic greeting.')
.summary('Generic Greeting')
.description('Prints a generic greeting.')

router.get('/hello/:name', function (req, res){
    res.send(`Hello ${req.pathParams.name}`);
})
.pathParam(`name`, joi.string().required(), `Name to greet.`)
.response([`text/plain`], `A personalized greeting.`)
.summary(`Personalized greeting`)
.description(`Prints a personalized greeting.`)


// Add entry to myFoxxCollection
router.post(`/entries`, function(req, res){
    const data = req.body;
    const meta = foxxColl.save(req.body);
    res.send(Object.assign(data, meta));
})
.body(joi.object().required(), `Entry to store in the collection`)
.response(joi.object().required(), `Entry stored in the collection.`)
.summary(`Store an entry`)
.description(`Stores an entry in "myFoxxCollection"`);

//Retrieve entry from myFOxxCollection using AQL
router.get('/entries', function(req, res){
    const keys = db._query(aql`
    FOR entry IN ${foxxColl}
    RETURN entry._key
    `);
    res.send(keys);
})
.response(joi.array().items(
    joi.string().required()
).required(), 'List of Entry Keys.')
.summary('List of entry keys.')
.description('Assembles a list entry keys from myFoxxCollection.')




//Albums Collection Routes

// Add album to albumCollection
router.post('/albums', function(req, res){
    const data = req.body;
    const meta = albumColl.save(req.body);
    res.send(Object.assign(data, meta));
})
.body(joi.object().required(), 'Album to store in the collection.')
.response(joi.object().required(), 'Album stored in the collection.')
.summary('Store an album')
.description('Stores an album in "albums" collection.')

// Retrieve entry from albumCollection using AQL
router.get('/albums', function(req, res){
    const keys = db._query(aql`
    FOR entry IN ${albumColl}
    RETURN entry.album.name
    `);
    res.send(keys);
})
.response(joi.array().items(
    joi.string().required()
).required(), 'List of album names.')
.summary('List album names')
.description('Assembles a list of album names from the "albums" collection.')