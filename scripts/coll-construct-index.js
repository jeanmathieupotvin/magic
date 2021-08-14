/**
 * coll-construct-index.js
 * 
 * 
 * Create an array of Collection objects.
 * A Collection represents a Scryfall list and a physical binder's section.
 * 
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

const fs   = require('fs');
const path = require('path');
const sf   = require('./lib/sf');

/**
 * Constants.
 */

const data = require(
  path.join(__dirname, '..', process.env.PATH_FILE_SCRYFALL_ARCHIVE));

/**
 * Loop over Scryfall Deck objects contained in the Scryfall Archives
 * and create Collections derived from them.
 */

const colls = data.decks
  // Extract true Collections only.
  .filter(e => e.name.startsWith('Collection:'))
  // Create Collection objects from Scryfall Deck objects.
  .map(e => sf.Collection(e))
  // Sort Collection objects alphabetically by name.
  .sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return  1; }
    return 0;
  });

/**
 * Store the Collections' array.
 */

fs.writeFileSync(
  path.join(__dirname, '..', process.env.PATH_FILE_COLLECTIONS_INDEX),
  JSON.stringify(colls, null, 4));

/**
 * Print a friendly message.
 */

console.log(`A collection index was generated for @${data.username}. It has ${colls.length} entries.`);
