/**
 * sf.js
 * 
 * 
 * Helper functions to interact with Scryfall's API and data. Also
 * includes other miscellaneaous features.
 * 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

const fs    = require('fs');
const path  = require('path');
const fetch = require('node-fetch');

/**
 * Create a new Collection from a Scryfall Deck.
 * 
 * @param {string} id   - Scryfall unique ID.
 * @param {string} uri  - Full Scryfall URI to deck.
 * @param {string} name - Collection's name.
 * @param {string} description - Deck's description. It should contain
 *     key:value pairs starting with pair set:something.
 * 
 * @returns {{ object: string, name: string, set: string, id: string, uri: string }}
 *     A Collection object derived from the Deck object.
 */
 function Collection({ id, uri, name, description }) {
  let set = description
    // Split key:value pairs.
    .split(' ')
    // Only keep the set key. Extract it from the array.
    .filter(e => e.startsWith('set:'))[0]
    // Drop the key name from the string.
    ?.substr(4);

  return { object: 'collection', name, set, id, uri };
}

/**
 * Create a file name for a Collection from its name.
 * 
 * @param {string} coll   - A Collection object.
 * @param {string} format - The file extension to use. Do not include the dot.
 * @returns {string} A file name for the underlying Collection.
 */
function createCollectionFileName(coll, format = 'csv') {
  return coll.name
    // Remove standard string 'Collection: ' from name. 
    .replace('Collection: ', "")
    // Enforce lower cases.
    .toLocaleLowerCase()
    // Remove punctuation characters.
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '')
    // Replace all spaces by hyphens.
    .replace(/\s/g, '-')
    // Add the set key at the end of the name.
    .concat('-', coll.set)
    // Add file extension.
    .concat('.', format);
}

/**
 * Create a /collections subdirectory if it does not exist.
 * 
 * @param {string} dir - Relative path to a directory to be created. 
 * @returns {null} 
 */
function createCollectionDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return null;
};

/**
 * Fetch a Collection from Scryfall.
 * 
 * @param {object} coll   - A Collection object.
 * @param {string} dir    - Destination directory for the fetched collection.
 * @param {string} format - Desired file format.
 * @returns {Promise} This function is used for its side-effect.
 */
 function fetchCollection(coll, dir, format = "csv") {
  fetch(coll.uri.concat(`/export/${format}`))
    .then(res => {
      // If res.status >= 200 && res.status < 300,
      // stream the downloaded file to a properly
      // named file. It is named after the downloaded
      // collection
      if (res.ok) {
        const file = path.join(dir, createCollectionFileName(coll, format));
        const sink = fs.createWriteStream(file);
        
        res.body.pipe(sink);
      }

      console.log(`HTTP  ${res.status}  ${res.statusText}  ${coll.id}  ${coll.name}`);
    });
};

/**
 * Export everything.
 */

module.exports = {
  Collection,
  createCollectionFileName,
  createCollectionDir,
  fetchCollection
};
