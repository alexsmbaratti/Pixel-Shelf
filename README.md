# Pixel Shelf
Pixel Shelf is a web server that can be used to track and organize your video game collection.

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
4. Run `npm start` to run the web server on localhost:3000