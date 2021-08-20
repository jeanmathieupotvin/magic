/* sf.js
 * 
 * 
 * Helper functions to interact with Scryfall's API and data. Also
 * includes other miscellaneaous features.
 * 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */


const fs      = require('fs');
const path    = require('path');
const fetch   = require('node-fetch');
const csvSync = require('csvsync');


// Functions -------------------------------------------------------------------


/**
 * Create a new Collection from a Scryfall Deck.
 * 
 * @param {string} id   - Scryfall unique ID.
 * @param {string} uri  - Full Scryfall URI to deck.
 * @param {string} name - Collection's name.
 * @param {string} description - Deck's description. It should contain
 *     key:value pairs starting with pair set:something.
 * 
 * @returns {{ 
 *     object: string,
 *     name: string,
 *     set: string, 
 *     id: string, 
 *     uri: string }} A Collection object derived from the Deck object.
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
 * 
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
 * 
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
 * 
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
 * Extract statistics on a collection from a daily files stored in prices/.
 * 
 * @param {string} file     - A file path to some file in prices/.
 * @param {string} collName - A collection's name.
 * 
 * @returns {{ 
 *     as_of_date: string, 
 *     count: number, 
 *     usd_price: number,
 *     mean_unitary_price: number }} An object holding daily statistics on 
 *     collection.
 */
function getCollectionPriceStats(file, collName = 'total') {
  let csv   = fs.readFileSync(file);
  let rows  = csvSync.parse(csv, { returnObject: true });
  let total = rows.filter(row => row.collection === collName)[0];
  let { as_of_date, count, usd_price, mean_unitary_price } = total;

  count = parseInt(count);
  usd_price = parseFloat(usd_price);
  mean_unitary_price = parseFloat(mean_unitary_price);

  return { as_of_date, count, usd_price, mean_unitary_price };
};


/**
 * Compute and append (1) daily gains and losses and (2) daily rates of return
 * to an object holding daily statistis on a collection.
 * 
 * @param {{
 *     as_of_date: string, 
 *     count: number, 
 *     usd_price: number,
 *     mean_unitary_price: number}[]} stats - An array of objects holding daily 
 *     statistics.
 * 
 * @returns {{ 
 *     as_of_date: string, 
 *     count: number, 
 *     usd_price: number,
 *     mean_unitary_price: number,
 *     gains_losses: number,
 *     rate_of_return: string,
 *     trend: string }[]} An array of objects holding daily statistics
 *     on collection.
 */
function computeCollectionGainsLosses(stats) {
  stats.map((e, i, arr) => {
    if (i === 0) {
      e.gains_losses   = NaN;
      e.rate_of_return = NaN;
      e.trend = '🡺';
    } else {
      let pOld = arr[i - 1].usd_price;
      let diff = e.usd_price - pOld;
      let rate = diff / pOld;

      e.gains_losses   = parseFloat(Number(diff).toFixed(2));
      e.rate_of_return = Number(rate * 100).toFixed(2).concat('%');
      e.trend = (e.gains_losses >= 0) ? '🡹' : '🡻'; 
    }
  });

  return stats;
}


// Export ----------------------------------------------------------------------


module.exports = {
  Collection,
  createCollectionFileName,
  createCollectionDir,
  fetchCollection,
  getCollectionPriceStats,
  computeCollectionGainsLosses
};
