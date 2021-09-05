CREATE TABLE game
(
    title      TEXT NOT NULL,
    platformid INTEGER,
    igdbURL    TEXT,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (platformid) REFERENCES platform (id)
);

CREATE TABLE platform
(
    name    TEXT NOT NULL,
    brandid INTEGER,
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (brandid) REFERENCES brand (id)
);

CREATE TABLE edition
(
    edition     TEXT NOT NULL,
    upc         TEXT,
    msrp        REAL,
    gameid      INTEGER,
    trackingURL TEXT,
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (gameid) REFERENCES game (id)
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
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id),
    FOREIGN KEY (retailerid) REFERENCES retailer (id)
);

CREATE TABLE amiibo
(
    title    TEXT NOT NULL,
    seriesid INTEGER,
    msrp     REAL,
    type     INTEGER,
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (seriesid) REFERENCES series (id)
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
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (retailerid) REFERENCES retailer (id),
    FOREIGN KEY (amiiboid) REFERENCES amiibo (id)
);

CREATE TABLE retailer
(
    retailer TEXT NOT NULL,
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
    FOREIGN KEY (editionid) REFERENCES edition (id)
);
