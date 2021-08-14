# coll-assemble.R


# Assemble Collections stored in CSV in a collections/ directory into
# a single unified CSV file. Sets' names and codes are set equal to
# their true value (these are given by the underlying file names).


# Copyright (c) 2021 Jean-Mathieu Potvin
# MIT License


# Packages ---------------------------------------------------------------------


library(data.table)


# Read and store environment variables -----------------------------------------


readRenviron('.env')


# Source helper functions ------------------------------------------------------


source(file.path("scripts", "lib", "sf.R"))


# Read, parse and modify all Collections ---------------------------------------


# List Collections stored in collections' folder.
files <- list.files(Sys.getenv("PATH_DIR_COLLECTIONS"), full.names = TRUE)
colls <- lapply(files, readModifyCollection)


# Unify all Collections and store output ---------------------------------------


data.table::fwrite(
    x    = out <- data.table::rbindlist(colls, use.names = TRUE, fill = TRUE),
    file = Sys.getenv("PATH_FILE_COLLECTION"))


# Print friendly message to console --------------------------------------------


cat(
    sprintf(
        "Read and unified %i Collections. It has %i cards. Total value is %i$ US.",
        length(colls),
        out[, sum(count)],
        out[, as.integer(sum(count * usd_price))]))
