FROM node:12

WORKDIR /usr/src/Pixel-Shelf

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN mkdir models/db
RUN cat models/initdb.sql | sqlite3 models/db/pixelshelf.db

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]