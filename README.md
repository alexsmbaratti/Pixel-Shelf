# Pixel Shelf

Pixel Shelf is a web server that can be used to track and organize your video game collection.

## Prerequisites

* NPM and Node.js
* SQLite3
* Node-Sass

## Installation

1. Clone or fork the repository
2. Run `npm install`
3. In the project folder, initialize the SQLite3 database with the following commands:

```sh
cd models
sqlite3 pixelshelf.db
.read initdb.sql
.quit
```

4. Run `node-sass --omit-source-map-url sass/styles.scss public/stylesheets/styles.css` from the project folder to build
   the CSS
5. Create folders for images and covers according to the following file structure: ./public/images/covers
6. Create a `config.json` file
```json
{
"sql_path": "path/to/initialized/db",
"client_id": "igdb_client_id",
"client_secret": "igdb_client_secret",
"token": "igdb_token",
"e-ink": false,
}
```

7. Run `npm start` to run the web server on localhost:3000
