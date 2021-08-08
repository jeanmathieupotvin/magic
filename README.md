# magic

A collection of scripts to fetch data from Scryfall and organize it. These are used to maintain a big inventory of Magic: The Gathering hosted on [Scryfall](https://scryfall.com/). The scripts are not production-ready, they are meant to be used personally.

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
└── scripts/
    └── lib/
```

# Environment variables

`magic` currently uses 4 environment variables:

- `PATH_SCRYFALL_ARCHIVE`: relative path to a Scryfall Archive JSON file. This file can be downloaded [here](https://scryfall.com/settings/archive).
- `PATH_COLLECTION_FILE`: relative path to a to-be-created unified CSV file.
- `PATH_COLLECTIONS_SUBDIR`: relative path to a subdirectory that contains all individual CSV collections / list to-be-fetched from Scryfall.
- `PATH_COLLECTIONS_INDEX_NAME`: relative path to a to-be-created JSON file containing a single array of Collection objects.

# Usage

TBD.
