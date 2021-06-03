DROP TABLE game;
DROP TABLE platform;
DROP TABLE edition;
DROP TABLE library;

CREATE TABLE game
(
    title      TEXT,
    platformid INTEGER,
    id         INTEGER PRIMARY KEY,
    FOREIGN KEY (platformid) REFERENCES platform (id)
);

CREATE TABLE platform
(
    name TEXT,
    id   INTEGER PRIMARY KEY
);

CREATE TABLE edition
(
    name   TEXT,
    upc    TEXT,
    msrp   REAL,
    gameid INTEGER,
    id     INTEGER PRIMARY KEY,
    FOREIGN KEY (gameid) REFERENCES game (id)
);

CREATE TABLE library
(
    cost      REAL,
    month     INTEGER,
    day       INTEGER,
    year      INTEGER,
    editionid INTEGER,
    id        INTEGER PRIMARY KEY,
    FOREIGN KEY (editionid) REFERENCES edition (id)
);

INSERT INTO platform
VALUES ('Nintendo Switch', 1);
INSERT INTO game
VALUES ('The Legend of Zelda: Breath of the Wild', 1, 1);
INSERT INTO edition
VALUES ('Standard Edition', NULL, 59.99, 1, 1);
INSERT INTO library
VALUES (59.99, 4, 3, 2017, 1, 1);