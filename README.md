# magic · ![](https://img.shields.io/badge/version-1.2.0-blue?style=flat-square)

A collection of scripts to fetch data from Scryfall and organize it. These are
used to maintain a big inventory of Magic: The Gathering cards hosted on 
[Scryfall](https://scryfall.com/). The scripts are not production-ready, they
are meant to be used personally.

> Warning! This project is not affiliated to [Scryfall](https://scryfall.com/)
> in any way and is not endorsed by Scryfall's team. This is an independent
> initiative. I just humbly believe Scryfall is an awesome web application.

# Installation

Clone this repository or
[download the latest release](https://github.com/jeanmathieupotvin/magic/releases).

```bash
git clone https://github.com/jeanmathieupotvin/magic.git
```

Ensure that you have both [R](https://www.r-project.org/) and 
[NodeJS](https://nodejs.dev/) installed on your computer. They must both be on
your `PATH` environment variable. Then, open a command-line tool, and run these
lines of code.

```bash
cd <this-project-path>
npm install
```

You are good to go!

# Structure

This project has a very simple structure. The `.env` file contains enviromment 
variables used by JavaScript and R scripts. These are not sensible, and can be
safely committed. All personal data goes into `data/`, scripts that operate on
this data go into `scripts/`, and any other helper functions called by the
scripts go into `scripts/lib`. Functions stored in that `lib/` location are
organized by language.

It is up to you to decide whether you want to track `data/` or not. Git
ignores it by default.

```
/
├── .env
├── .gitignore
├── LICENSE
├── magic.code-workspace
├── magic.Rproj
├── package.json
├── package-lock.json
├── README.md
├── node_modules/
├── data/
│   ├── collections/
│   │   └── <collection-name-collection-code.csv>
│   ├── decks/
│   │   └── <format-deck-name.[csv|txt]>
│   ├── prices/
│   │   └── <yyyy-mm-dd.csv>
│   ├── collection.csv
│   ├── collection-index.json
│   ├── collection-prices.csv
│   └── scryfall-archive.json
└── scripts/                    [order]
    ├── coll-construct-index.js [  1  ]
    ├── coll-fetch.js           [  2  ]
    ├── coll-assemble.R         [  3  ]
    ├── coll-price.R            [  4  ]
    ├── coll-track.js           [  5  ]
    └── lib/
        ├── sf.js
        └── sf.R
```

# Environment variables

- `PATH_FILE_SCRYFALL_ARCHIVE`: relative path to a 
[Scryfall Archive JSON file](https://scryfall.com/settings/archive).
- `PATH_FILE_COLLECTION`: relative path to a CSV file that is the
union of all collections.
- `PATH_FILE_COLLECTION_INDEX`: relative path to a JSON file that contains a
single array of Collection objects.
- `PATH_FILE_COLLECTION_PRICES`: relative path to a CSV file that contains
statistics derived from historical daily USD prices of the whole collection.
- `PATH_DIR_PRICES`: relative path to a subdirectory that contains all CSV files
of statistics on collections' daily USD prices.
- `PATH_DIR_COLLECTIONS`: relative path to a subdirectory that contains all 
collections' CSV files fetched from Scryfall.

# Setup and conventions on Scryfall

You need to have a valid [Scryfall](https://scryfall.com/) account. Then, create
an arbitrary number of Decks/Lists and follow these conventions. A Scryfall
Deck/List is called a *collection* in this project.

1. Give a name to your collection. Follow this convention: `Collection: <your-name-goes-here>`.
2. Give a description to your collection. Follow this convention:
`set:<set-code-or-null-string> desc:<description-if-any>`.
    
    - The Scryfall description field must always begin by a `set` key. If there
    is none, set it equal to `set:null`.
    - The Scryfall description field can contain anything, as long as you
    categorize your contents in `key:value` pairs separated by exactly one space.
    - Use lower cases only.

# Usage

1. Configure environment variables once. Do this only if the default values 
do not meet your needs.

2. Download your own personal 
[Scryfall Archive JSON file](https://scryfall.com/settings/archive) and store it
in `data/`. This must (sadly) be done manually. **It is your responsability to
update this file whenever the state of your Scryfall data changes**. Scryfall's
API does not let us fetch that data programatically yet.

3. Use `npm` scripts. Consult `package.json` for their name.

```bash
npm run <script>
```

# Scripts

**Full pipelines**
- `collect` : sequentially run (1) `coll-index`, (2) `coll-fetch`, 
(3) `coll-assemble`, (4) `coll-price` and (5) `coll-track`.

**Individual scripts**
1. `coll-index` : generate an index of all your collections stored on Scryfall. 
This creates a JSON file that contains a single array of `Collection` objects.
See section [The Collection object](#the-collection-object). 
    + This creates file `PATH_FILE_COLLECTION_INDEX` from `PATH_FILE_SCRYFALL_ARCHIVE`.

2. `coll-fetch` : fetch all collections listed in the index and store them in 
individual CSV files in `PATH_DIR_COLLECTIONS`.

3. `coll-assemble` : assemble all individual collections' CSV files into a 
single CSV file. Rearrange columns for easier management.
    + This creates file `PATH_FILE_COLLECTION`.

4. `coll-price` : compute statistics on collections' daily USD prices and store
them in a CSV file in `PATH_DIR_PRICES`.

5. `coll-track` : track statistics on historical daily USD prices of the unified
collection.
    + This creates file `PATH_FILE_COLLECTIONS_PRICE`.

# The `Collection` object

`magic` relies on *collections* stored on Scryfall. These are represented by
JavaScript `Collection` objects. This is what is stored in the collections'
index. A `Collection` object is derived from Scryfall's formal `Deck` object.

```js
{
    object: "collection",
    name: "Collection: Adventures in the Forgotten Realms",
    set: "afr",
    id: "4262askh-3gd9-s4hd-fkhg8-d4d46281jec7",
    uri: "https://api.scryfall.com/decks/4262askh-3gd9-s4hd-fkhg8-d4d46281jec7"
}
```

A `Collection` object is constructed from a `Scryfall::Deck` that was generated
following the conventions enumerated in section
[Setup and conventions on Scryfall](#setup-and-conventions-on-scryfall). It is
designed to be a *verbose* pointer to a `Scryfall::Deck`.

# Bugs and feedback

Submit them [here](https://github.com/jeanmathieupotvin/magic/issues/new).
Thank you for your help!
