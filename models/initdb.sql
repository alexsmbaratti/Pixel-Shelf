CREATE TABLE game
(
    title      TEXT NOT NULL,
    platformid INTEGER,
    igdbURL    TEXT,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (platformid) REFERENCES platform (id) ON DELETE CASCADE,
    FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE SET NULL
);

CREATE TABLE platform
(
    name    TEXT NOT NULL,
    brandid INTEGER,
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (brandid) REFERENCES brand (id) ON DELETE CASCADE
);

CREATE TABLE edition
(
    edition     TEXT    NOT NULL,
    upc         TEXT,
    msrp        REAL,
    gameid      INTEGER,
    trackingURL TEXT,
    digital     INTEGER NOT NULL,
    currencyid  INTEGER,
    region      TEXT,
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (gameid) REFERENCES game (id) ON DELETE CASCADE,
    FOREIGN KEY (currencyid) REFERENCES currency (id) ON DELETE SET NULL
);

CREATE TABLE library
(
    cost       REAL,
    timestamp  TEXT,
    editionid  INTEGER,
    retailerid INTEGER,
    new        INTEGER NOT NULL,
    box        INTEGER NOT NULL,
    manual     INTEGER NOT NULL,
    progress   INTEGER NOT NULL,
    gift       INTEGER NOT NULL,
    currencyid INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id) ON DELETE CASCADE,
    FOREIGN KEY (retailerid) REFERENCES retailer (id) ON DELETE SET NULL,
    FOREIGN KEY (currencyid) REFERENCES currency (id) ON DELETE SET NULL
);

CREATE TABLE amiibo
(
    title      TEXT NOT NULL,
    seriesid   INTEGER,
    msrp       REAL,
    type       INTEGER,
    currencyid INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (seriesid) REFERENCES series (id) ON DELETE CASCADE,
    FOREIGN KEY (currencyid) REFERENCES currency (id) ON DELETE SET NULL
);

CREATE TABLE series
(
    series TEXT NOT NULL,
    id     INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE figure
(
    cost       REAL,
    timestamp  TEXT,
    retailerid INTEGER,
    new        INTEGER NOT NULL,
    inbox      INTEGER NOT NULL,
    amiiboid   INTEGER,
    region     TEXT,
    gift       INTEGER NOT NULL,
    currencyid INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (retailerid) REFERENCES retailer (id) ON DELETE SET NULL,
    FOREIGN KEY (amiiboid) REFERENCES amiibo (id) ON DELETE CASCADE,
    FOREIGN KEY (currencyid) REFERENCES currency (id) ON DELETE SET NULL
);

CREATE TABLE retailer
(
    retailer TEXT    NOT NULL,
    subtext  TEXT,
    online   INTEGER NOT NULL,
    lat      REAL,
    long     REAL,
    url      TEXT,
    id       INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE brand
(
    brand TEXT UNIQUE NOT NULL,
    id    INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE wishlist
(
    editionid INTEGER,
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id) ON DELETE CASCADE
);

CREATE TABLE igdb
(
    description TEXT,
    cover       BLOB,
    igdbURL     TEXT PRIMARY KEY
);

CREATE TABLE rating
(
    orgid INTEGER,
    id    INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE genre
(
    description TEXT,
    id          INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE hasagenre
(
    igdbURL TEXT,
    genreid INTEGER,
    PRIMARY KEY (igdbURL, genreid),
    FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE CASCADE,
    FOREIGN KEY (genreid) REFERENCES genre (id) ON DELETE CASCADE
);

CREATE TABLE hasarating
(
    igdbURL  TEXT,
    ratingid INTEGER,
    PRIMARY KEY (igdbURL, ratingid),
    FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE CASCADE,
    FOREIGN KEY (ratingid) REFERENCES rating (id) ON DELETE CASCADE
);

CREATE TABLE currency
(
    symbol TEXT,
    format INTEGER,
    id     INTEGER PRIMARY KEY AUTOINCREMENT
);