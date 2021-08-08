# coll-assemble.R
#
# Assemble Collections stored in CSV in a collections/ directory into
# a single unified CSV file. Sets' names and codes are set equal to
# their true value (these are given by the underlying file names).
#
# Copyright (c) 2021 Jean-Mathieu Potvin
# MIT License

library(data.table)

# Read environment variables.
readRenviron('.env')

# Source helper functions.
source(file.path("scripts", "lib", "sf.R"))

# Get Collections stored in collections' folder.
files <- list.files(
  Sys.getenv("PATH_COLLECTIONS_SUBDIR"),
  full.names = TRUE)

# Read, parse and modify all Collections.
colls <- lapply(files, readModifyCollection)

# Unify all Collections and store output.
data.table::fwrite(
    x    = out <- data.table::rbindlist(colls),
    file = Sys.getenv("PATH_COLLECTION_FILE"))

# Print friendly message.
cat(
  sprintf(
    "Read and unified %i Collections. It has %i cards. Total value is %i$ US.",
    length(colls),
    out[, sum(count)],
    out[, as.integer(sum(count * usd_price))]))
