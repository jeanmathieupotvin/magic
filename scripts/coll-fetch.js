/**
 * coll-fetch.js
 * 
 * Create and populate a collections/ directory.
 * This fetches all collections found in an array of Collection objects and
 * stores them in data/collections/. 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

const path = require('path');
const sf   = require('./lib/sf');

/**
 * Constants.
 */

const PATH_COLLECTIONS_SUBDIR = path.join(
  __dirname, '..', process.env.PATH_COLLECTIONS_SUBDIR);

/**
 * Read and import index.
 */

const collections = require(path.join(
  __dirname, '..', process.env.PATH_COLLECTIONS_INDEX_NAME));

/**
 * Create a /data/collections subdirectory.
 */

sf.createCollectionDir(
  path.join(__dirname, '..', process.env.PATH_COLLECTIONS_SUBDIR));

/**
 * Loop over Collections and fetch them (CSV format).
 */

collections.forEach(e => sf.fetchCollection(e, PATH_COLLECTIONS_SUBDIR));
