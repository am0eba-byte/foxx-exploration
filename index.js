'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi'); // imported from npm
const db = require(`@arangodb`).db;
const foxxColl = db._collection(`myFoxxCollection`);
const aql = require('@arangodb').aql;

module.context.use(router);

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