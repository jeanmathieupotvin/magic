/* coll-fetch.js
 * 
 * 
 * Create and populate a collections/ directory.
 * This fetches all collections found in an array of Collection objects and
 * stores them in data/collections/. 
 * 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */


const path = require('path');
const sf   = require('./lib/sf');


// Constants -------------------------------------------------------------------


const PATH_DIR_COLLECTIONS = path.join(
  __dirname, '..', process.env.PATH_DIR_COLLECTIONS);


// Read and import index -------------------------------------------------------


const collections = require(path.join(
  __dirname, '..', process.env.PATH_FILE_COLLECTION_INDEX));


// Create a /data/collections subdirectory -------------------------------------


sf.createCollectionDir(
  path.join(__dirname, '..', process.env.PATH_DIR_COLLECTIONS));


// Fetch and store all collections ---------------------------------------------


// We store collections in a CSV format.
// This also prints information on what was fetched to the console.
collections.forEach(e => sf.fetchCollection(e, PATH_DIR_COLLECTIONS));
