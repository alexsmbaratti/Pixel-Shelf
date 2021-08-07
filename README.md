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

### Docker

The provided Dockerfile will allow you to run Pixel Shelf in a container. Note that you will still need to provide your
own rating icons.

```sh
docker build -t pixel-shelf . && docker run -p 0.0.0.0:3000:3000 pixel-shelf
```

### Manual

1. Clone or fork the repository
2. Run `npm install`
3. In the project folder, initialize the SQLite3 database with the following commands:

```sh
cd models
mkdir db
cat initdb.sql | sqlite3 db/pixelshelf.db
```

4. Run `npx node-sass --omit-source-map-url sass/styles.scss public/stylesheets/styles.css` from the project folder to
   build the CSS
5. Create folders for images and rating icons according to the following file structure: ./public/images/ratings
6. Create a `config.json` file

```json
{
  "client_id": "igdb_client_id",
  "client_secret": "igdb_client_secret",
  "token": "igdb_token",
  "maps-key-path": "path/to/maps.p8",
  "maps-key-id": "key_id",
  "maps-team-id": "team_id"
}
```

7. Run `npm start` to run the web server on localhost:3000

Note: You must provide your own icons for game ratings.

## E-Ink Support

E-ink clients can be setup to fetch data from the API. All e-ink logic is contained within the eink folder. At the
moment, the [Adafruit 2.13" Monochrome E-Ink Bonnet for Raspberry Pi](https://www.adafruit.com/product/4687) is
currently supported. Running the eink.py script with Python on the e-ink client will allow the application to display
the size of your game collection on the screen. The buttons with cycle through the different screens, including wishlist
size and game identification mode, allowing a USB barcode scanner to display the name of a scanned game (provided the
UPC is in the database). Note that using a lower-model Pi, such as a Raspberry Pi Zero, will cause refresh rates to be
slow. At the moment, one screen change make take around ten seconds on these models.

![E-Ink Client Running on a Raspberry Pi Zero](https://alexsmbaratti.com/images/pixel-shelf/e_ink_example.jpg)

## Thermal Printer Support

## Attributions

Auto-generated cover art, tags, ratings, and descriptions are from IGDB's API.