# magic

A collection of scripts to fetch data from Scryfall and organize it. These are used to maintain a big inventory of Magic: The Gathering hosted on [Scryfall](https://scryfall.com/). The scripts are not production-ready, they are meant to be used personally.

# Installation

Just clone this repository. Your Magic data will be stored into it, see below.

```git
git clone https://github.com/jeanmathieupotvin/magic.git
```

Ensure that you have both [R](https://www.r-project.org/) and [NodeJS](https://nodejs.dev/) installed on your computer. They must both be on your `PATH` environment variable.

# Structure

This project has a very simple structure. The `.env` file contains enviromment variables used by JavaScript and R scripts. These are not sensible, and can be safely committed. All personal data goes into `data/`, scripts that operate on this data go into `scripts/`, and any other helper functions called by the scripts go into `scripts/lib`. Functions stored in that `lib/` location are organized by language.

It is up to you to decide whether you want to track `data/` or not. Git ignores by default.

```
/
├── .env
├── .gitignore
├── LICENSE
├── magic.code-workspace
├── package.json
├── package-lock.json
├── README.md
├── node_modules/
├── data/
│   ├── collections/
│   ├── decks/
│   ├── collection.csv
│   ├── collections.json
│   └── scryfall-archive.json
└── scripts/
    └── lib/
```

# Environment variables

- `PATH_SCRYFALL_ARCHIVE`: relative path to a Scryfall Archive JSON file. This file can be downloaded [here](https://scryfall.com/settings/archive).
- `PATH_COLLECTION_FILE`: relative path to a to-be-created unified CSV file.
- `PATH_COLLECTIONS_SUBDIR`: relative path to a subdirectory that contains all individual CSV collections / list to-be-fetched from Scryfall.
- `PATH_COLLECTIONS_INDEX_NAME`: relative path to a to-be-created JSON file containing a single array of Collection objects.

# Setup and conventions on Scryfall

You need to have a valid [Scryfall](https://scryfall.com/) account. Then, create an arbitrary number of Decks/Lists and follow these conventions. A Scryfall Deck/List is called a *collection* in this project.

1. Give a name to your collection. Follow this convention: `Collection: <your-name-goes-here>`.
2. Give a description to your collection. Follow this convention: `set:<set-code-or-null-string> desc:<description-if-any>`.
    
    - The Scryfall description field must always beging by a `set` key. If there is none, set it equal to `set:null`.
    - The Scryfall description field can contain anything, as long as you categorize your contents in `key:value` pairs separated by exactly one space.
    - Use lower cases only.

# Usage

1. Configure environment variables once (if required).
2. Download your own personal [Scryfall Archive JSON file](https://scryfall.com/settings/archive) and store it in `data/`. This must (sadly) be done manually. **It is your responsability to update this file whenever the state of your Scryfall data changes**. Scryfall's API does not let us fetch that data programatically yet.
3. Use  `npm` scripts.

```bash
npm run <script>
```

# Scripts

**Full pipelines**
- `collect` : sequentially run `coll-index`, `coll-fetch` and `coll-assemble`.

**Individual scripts**
- `coll-index` : generate an index of all your collections stored on Scryfall. This creates a JSON file that contains an array of `Collection` objects.
- `coll-fetch` : fetch all collections listed in the index and store them in individual CSV files.
- `coll-assemble` : assemble all individual collections' CSV files into a single CSV file. Rearrange columns for easier management.

# The Collection object

`magic` relies on *collections* stored on Scryfall. These are represented by JavaScript `Collection` objects. This is what is stored in the collections' index. A `Collection` object is derived from Scryfall's formal `Deck` object.

```js
{
    object: "collection",
    name: "Collection: Adventures in the Forgotten Realms",
    set: "afr",
    id: "8250dcc9-b3e6-418f-aada-d4d734564ec7",
    uri: "https://api.scryfall.com/decks/8250dcc9-b3e6-418f-aada-d4d734564ec7"
}
```

A `Collection` object is constructed from a `Scryfall::Deck` object that was generated following the conventions enumerated in section [Setup and conventions on Scryfall](#setup-and-conventions-on-scryfall). It is designed to be a *verbose* pointer to a `Scryfall::Deck`.

# Bugs and feedback

Submit them [here](https://github.com/jeanmathieupotvin/magic/issues/new). Thank you for your help!
