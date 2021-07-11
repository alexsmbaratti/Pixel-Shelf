# Pixel Shelf

Pixel Shelf is a web server that can be used to track and organize your video game collection. With rich metadata, you
can see all the details about a particular game in your collection at a glance, including cost breakdown, game progress,
and the condition of the physical copy.

![Pixel Shelf's library entry page](https://alexsmbaratti.com/images/pixel-shelf/library_screenshot.png)

## Prerequisites

* NPM and Node.js
* SQLite3
* Node-Sass
* IGDB API Access Credentials

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

4. Run `npx node-sass --omit-source-map-url sass/styles.scss public/stylesheets/styles.css` from the project folder to
   build the CSS
5. Create folders for images and rating icons according to the following file structure: ./public/images/ratings
6. Create a `config.json` file

```json
{
  "sql_path": "path/to/initialized/db",
  "client_id": "igdb_client_id",
  "client_secret": "igdb_client_secret",
  "token": "igdb_token",
  "e-ink": false
}
```

7. Run `npm start` to run the web server on localhost:3000

Note: You must provide your own icons for game ratings.

## E-Ink Support

Enabling e-ink display support can be achieved by setting the `e-ink` attribute in the `config.json`
file to `true`. At the moment,
the [Adafruit 2.13" Monochrome E-Ink Bonnet for Raspberry Pi](https://www.adafruit.com/product/4687) is currently
supported. Enabling support will allow the application to display the size of your game collection on the screen, as
well as allowing a USB barcode scanner to display the name of a scanned game (provided the UPC is in the database).

E-ink clients can also be setup to fetch data from the API.

## Attributions

Auto-generated cover art, tags, ratings, and descriptions are from IGDB's API.