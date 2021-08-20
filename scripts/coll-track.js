/* coll-track.js
 * 
 * 
 * Track historical prices of the unified collection.
 * This loops over total daily USD prices stored in prices/ and creates a
 * new file that contains historical prices of the overall collection.
 * 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */


const fs      = require('fs');
const path    = require('path');
const csvSync = require('csvsync');
const sf      = require('./lib/sf');


// Constants -------------------------------------------------------------------


const PATH_DIR_PRICES = path.join(
  __dirname, '..', process.env.PATH_DIR_PRICES);

const PATH_FILE_COLLECTIONS_PRICES = path.join(
  __dirname, '..', process.env.PATH_FILE_COLLECTIONS_PRICES);


// List files in prices directory ----------------------------------------------


let files = fs.readdirSync(PATH_DIR_PRICES)
  .map(file => path.join(PATH_DIR_PRICES, file));


// Extract daily states of total collection ------------------------------------


let stats = files.map(file => sf.getCollectionPriceStats(file));


// Compute daily gains/losses and rates of return ------------------------------


stats = sf.computeCollectionGainsLosses(stats);


// Store the statistics --------------------------------------------------------


// Create file and add headers.
let headers = [ 
  'as_of_date', 
  'count', 
  'usd_price', 
  'mean_unitary_price', 
  'gains_losses', 
  'rate_of_return',
  'trend' ];

// Add records of daily statistics.
fs.writeFileSync(
  PATH_FILE_COLLECTIONS_PRICES, 
  csvSync.stringify( [ headers, ...stats.map(e => Object.values(e)) ] ));


// Print a friendly message ----------------------------------------------------


console.log(`A price history was generated. It has ${files.length} records.`);
