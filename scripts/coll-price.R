# coll-price.R


# Compute statistics on daily US prices of a unified Collection CSV file.


# Copyright (c) 2021 Jean-Mathieu Potvin
# MIT License


# Packages ---------------------------------------------------------------------


library(data.table)


# Read and store environment variables -----------------------------------------


readRenviron('.env')


# Read Collection file ---------------------------------------------------------


collFile <- Sys.getenv("PATH_FILE_COLLECTION")
csv      <- data.table::fread(collFile)

# Read last time file was fetched.
# We assume this is equal to the last time the Collection file was modified.
asOfDate <- format(file.info(collFile)$mtime, format = "%Y-%m-%d")


# Compute statistics -----------------------------------------------------------


# Statistics aggregated by collections.
statsByColl <- csv[, .(
    as_of_date         = asOfDate,
    collection_code    = collection_code[[.N]],
    count              = sum(count, na.rm = TRUE),
    usd_price          = sum(count * usd_price, na.rm = TRUE),
    mean_unitary_price = round(
        sum(count * usd_price, na.rm = TRUE) / sum(count, na.rm = TRUE),
        digits = 2L)
), by = collection]

# Statistics on collection as a whole.
statsTot <- csv[, .(
    as_of_date         = asOfDate,
    collection         = "total",
    collection_code    = "null",
    count              = sum(count, na.rm = TRUE),
    usd_price          = sum(count * usd_price, na.rm = TRUE),
    mean_unitary_price = round(
        sum(count * usd_price, na.rm = TRUE) / sum(count, na.rm = TRUE),
        digits = 2L)
)]

# Bind all statistics together.
# Tables' have an identical structure and can be bound by rows.
stats <- rbind(statsTot, statsByColl)


# Store output -----------------------------------------------------------------


# Create prices directory.
dir.create(Sys.getenv("PATH_DIR_PRICES"), FALSE, FALSE)

# Store CSV file.
# It is named after the previously fetched as of date.
data.table::fwrite(
    x    = stats,
    file = file.path(Sys.getenv("PATH_DIR_PRICES"), sprintf("%s.csv", asOfDate)))


# Print statistics to console --------------------------------------------------


cat(sprintf("Prices and statistics as of %s.\n\n", asOfDate))
print(
    stats[, -c(1L, 3L)][order(usd_price, decreasing = TRUE)],
    row.names = FALSE)
