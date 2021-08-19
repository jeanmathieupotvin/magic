# sf.R


# R Helper functions to interact with Scryfall's API and data.
# Also includes other miscellaneaous features.


# Copyright (c) 2021 Jean-Mathieu Potvin
# MIT License


# Functions --------------------------------------------------------------------


#' @name readModifyCollection
#'
#' @description Read, parse and modify a (raw) Collection CSV file.
#'
#' @param path [character(1L)] A file path pointing to a CSV file.
#'
#' @return A `data.table::data.table` object.
#'
#' @export
readModifyCollection <- function(path)
{
    # Extract file name and drop extension.
    file <- gsub(".csv", "", basename(path))

    # Extract name and code from file name.
    collCode <- data.table::last(strsplit(file, "-", TRUE)[[1L]])
    collName <- gsub(paste0("-", collCode), "", file)

    csv <- data.table::fread(path)

    # Modify the Collection and return it.
    return(
        csv[, .(
            collection      = collName,
            collection_code = collCode,
            set,
            set_code,
            rarity,
            count,
            name,
            collector_number,
            lang,
            foil,
            usd_price,
            scryfall_uri,
            scryfall_id
        )]
    )
}
