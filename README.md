# foxx-exploration

just noodling around with foxx

## License

Copyright (c) 2022 Mia Borgia. All rights reserved.






## Goal: 
- Make an app that allows users to request album data by year, and artist (maybe also by song at some point)
  
- Users can also request to see other albums in the DB that were released in the same year or the same decade as the one they've requested
  
- Users can post new album data/update existing album data
  
- Make a nifty graph vizualization of albums in the DB as they are connected to each other thru artists (simple _to and _from)

- Make an extra nifty graph visualization of albums in the DB as they are connected to eachother thru decade edges (need to create "decade" objects as edge node targets for this one)

### To Do:
- set up random ID generation (like in the GitHub app)

#### Data we need to create album:
- all metadata 
- artist ID

in post() request, add path to artist/:artistID
- post() req.body = all of album metadata
- point FROM album => figure out album ID 
- step 1: save album
- step 2: get that album's ID (aql "return new" google it broi)
- step 3: make edge collection FROM artistID TO albumID (NOT THE KEYS)


- to reference nodes in edge tos and froms: collectionName/collectionKey (albumColl/album._key) (artistColl/artist._key)

- REMIND JOSH/ALAN about Foxx Tools to automatically update API (no more uploading ZIP files and all that crap)




NEXT TO DO:

put all the fancy AQL edge doc creation stuffs in album POST()

- get back a tree of data (make a GET endpoint )

// gitignore node_modules DO IT