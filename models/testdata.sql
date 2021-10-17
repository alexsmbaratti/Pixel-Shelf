INSERT INTO brand
VALUES ('A Brand', 1);

INSERT INTO platform
VALUES ('A Console', 1, 'http://example.com/platforms/a-console', 1);

INSERT INTO igdbplatform
VALUES ('This is a description.', 1, NULL, 9, 'http://example.com/platforms/a-console');

INSERT INTO platform
VALUES ('B Console', 1, NULL, 2);

INSERT INTO retailer
VALUES ('A Retailer', 'Anytown Location', 0, 30.000, -70.000, NULL, 1);

INSERT INTO retailer
VALUES ('Pixel Shelf Shop Channel', NULL, 1, NULL, NULL, NULL, 2);

-- A Game
INSERT INTO game
VALUES ('A Game', 1, 'http://example.com/games/a-game', 1);

INSERT INTO igdb
VALUES ('This is a game.', NULL, NULL, 'http://example.com/games/a-game');

INSERT INTO edition
VALUES ('Standard Edition', '000000000000', 59.99, 1, 0, 'USD', 1, 1);

INSERT INTO edition
VALUES ('Special Edition', '000000000001', 99.99, 1, 0, 'USD', 1, 2);

INSERT INTO library
VALUES (39.99, '2021-01-01T00:00:00.000Z', 1, 1, 1, 1, 1, 3, 0, 'USD', 0, NULL, 1);

INSERT INTO library
VALUES (39.99, '2021-02-01T00:00:00.000Z', 1, NULL, 1, 1, 1, 3, 0, 'USD', 0, 'Random Second Copy without Retailer Information', 2);

-- B Game
INSERT INTO game
VALUES ('B Game', 2, 'http://example.com/games/b-game', 3);

INSERT INTO igdb
VALUES ('This is another game.', NULL, NULL, 'http://example.com/games/b-game');

INSERT INTO edition
VALUES ('Standard Edition', '000000000050', 29.99, 3, 0, 'USD', 1, 4);

INSERT INTO edition
VALUES ('Standard Edition', NULL, 29.99, 3, 1, 'USD', 1, 5);

INSERT INTO library
VALUES (NULL, '2021-01-01T00:00:00.000Z', 4, NULL, 1, 0, 0, 2, 1, 'USD', 0, 'A Gifted Copy', 4);

INSERT INTO library
VALUES (9.99, '2021-01-01T00:00:00.000Z', 5, NULL, 1, 0, 0, 2, 0, 'USD', 0, NULL, 5);

-- Z Game
INSERT INTO game
VALUES ('Z Game', 1, NULL, 2);

INSERT INTO edition
VALUES ('Digital Deluxe Edition', '000000000002', 79.99, 1, 1, 'USD', 1, 3);

INSERT INTO edition
VALUES ('Standard Edition', '000000000003', 59.99, 2, 0, 'USD', 1, 6);

INSERT INTO library
VALUES (79.99, '2021-01-01T00:00:00.000Z', 3, 2, 1, 0, 0, 2, 0, 'USD', 0, NULL, 3);

INSERT INTO library
VALUES (9.99, '2021-01-01T00:00:00.000Z', 6, NULL, 0, 1, 0, 2, 0, 'USD', 0, 'A Used Game', 6);