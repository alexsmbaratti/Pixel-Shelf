CREATE TABLE game
(
    title      TEXT,
    platformid INTEGER,
    igdbURL    TEXT,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (platformid) REFERENCES platform (id)
);

CREATE TABLE platform
(
    name    TEXT,
    brandid INTEGER,
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (brandid) REFERENCES brand (id)
);

CREATE TABLE edition
(
    edition     TEXT,
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
    new        INTEGER,
    box        INTEGER,
    manual     INTEGER,
    progress   INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id),
    FOREIGN KEY (retailerid) REFERENCES retailer (id)
);

CREATE TABLE amiibo
(
    title    TEXT,
    seriesid INTEGER,
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (seriesid) REFERENCES series (id)
);

CREATE TABLE series
(
    title TEXT,
    id    INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE figure
(
    cost       REAL,
    month      INTEGER,
    day        INTEGER,
    year       INTEGER,
    retailerid INTEGER,
    new        INTEGER,
    box        INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (retailerid) REFERENCES retailer (id)
);

CREATE TABLE retailer
(
    retailer TEXT,
    subtext  TEXT,
    online   INTEGER,
    lat      REAL,
    long     REAL,
    url      TEXT,
    id       INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE brand
(
    brand TEXT UNIQUE,
    id    INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE wishlist
(
    editionid INTEGER,
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id)
);

CREATE TABLE list
(
    gameid INTEGER UNIQUE,
    status INTEGER,
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (gameid) REFERENCES game (id)
);
