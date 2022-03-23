const db = require(`@arangodb`).db;
const foxxColl = db._collection(`myFoxxCollection`);
const albumColl = db._collection('albums');
const artistAlbums = db._collection('artistAlbums');
const artistColl = db._collection(`artistColl`);
const aql = require('@arangodb').aql;


// WRITE methods
export class musicDataWrite {
    // AQL queries here

    createAlbum = async (data) => {
        let saveAlbum = db._query(aql`
LET data = ${data}
INSERT data INTO albums
RETURN NEW
`)
        return saveAlbum
    }

    createArtist = async (artistData) => {
        let saveArtist = db._query(aql`
        LET data = ${artistData}
        INSERT data INTO artistColl
        RETURN NEW
        `)
        return saveArtist
    }

    // create new edge doc from artist to new album entry
    createArtistAlbumEdge = async (data) => {
        let createEdge = db._query(aql`
        FOR album IN albums
            FILTER album.album.name == ${data.album.name}
        FOR artist IN artistColl
        FILTER artist.artist.name == ${data.album.artist}
        INSERT {_from: artist._id, _to: album._id} IN artistAlbums
        RETURN NEW
        `);
        return createEdge
    }
}


// READ methods
export class musicDataRead {
    //Return list of albums and album props
    getAlbums = () => {
        let queryAlbums = db._query(aql`
FOR entry IN albums
RETURN entry.album
`);
        return queryAlbums
    }

    // return list of artists
    getArtists = () => {
        let queryArtists = db._query(aql`
    FOR entry IN artistColl
RETURN entry.artist.name
    `);
        return queryArtists
    }

    // get an artist by input album
    getArtistByAlbum = async(artistKEY) => {
        let queryArtistbyAlbum = db._query(aql`
        FOR artist IN artistColl
        FILTER artist._key == ${artistKEY}
        FOR VERTEX 1 .. 1 INBOUND artist artistAlbums
        RETURN VERTEX
        `);
        return queryArtistbyAlbum
    }

    
}



// data access methods for checking if things exist
export class musicInputDataCheck {
    // check if input album from req already exists
    albumExists = async (data) => {
        let albumCheck = db._query(aql`
    FOR album IN albums
    FILTER album.album.name == ${data.album.name}
    RETURN TO_BOOL(album.album.name) 
    `)
        return albumCheck
    } //returns false if album name is empty


    artistExists = async (data) => {
        let artistCheck = db._query(aql`
    FOR artist IN artistColl
    FILTER artist._key == ${data.artist}
    RETURN TO_BOOL(artist._key)
    `) // returns false if artist key is empty
        return artistCheck
    }
}