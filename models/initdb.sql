DROP TABLE game;
DROP TABLE platform;
DROP TABLE edition;
DROP TABLE library;
DROP TABLE retailer;

CREATE TABLE game
(
    title      TEXT,
    platformid INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (platformid) REFERENCES platform (id)
);

CREATE TABLE platform
(
    name TEXT,
    id   INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE edition
(
    edition TEXT,
    upc     TEXT UNIQUE,
    msrp    REAL,
    gameid  INTEGER,
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (gameid) REFERENCES game (id)
);

CREATE TABLE library
(
    cost       REAL,
    month      INTEGER,
    day        INTEGER,
    year       INTEGER,
    editionid  INTEGER,
    retailerid INTEGER,
    new        INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (editionid) REFERENCES edition (id)
        FOREIGN KEY (retailerid) REFERENCES retailer (id)
);

CREATE TABLE retailer
(
    retailer TEXT,
    lat      REAL,
    long     REAL,
    id       INTEGER PRIMARY KEY AUTOINCREMENT
);

INSERT INTO platform
VALUES ('Nintendo Switch', 1);
INSERT INTO game
VALUES ('The Legend of Zelda: Breath of the Wild', 1, 1);
INSERT INTO edition
VALUES ('Standard Edition', '45496590420', 59.99, 1, 1);
INSERT INTO library
VALUES (59.99, 4, 3, 2017, 1, NULL, 1, 1);